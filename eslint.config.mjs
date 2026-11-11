import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { readdirSync } from "node:fs";

// Business dependencies are explicit. New modules default to no module dependencies.
const moduleDependencies = {
  catalog: [],
  storefront: ["catalog"],
};
const moduleNames = readdirSync(new URL("./src/modules/", import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const publicApiPattern = {
  regex: "^@/modules/[^/]+/(?!server$|actions$)",
  message: "Use the module's root public API, /server, or /actions. Module internals are private; use relative imports inside the owning module.",
};
const routePattern = {
  regex: "^(?:@/app(?:/|$)|(?:\\.\\./)+app(?:/|$))",
  message: "Modules and shared code must not depend on Next.js route composition.",
};
const relativeModulePattern = {
  regex: `^(?:\\.\\./)+(?:modules(?:/|$)|(?:${moduleNames.map(escapeRegex).join("|")})(?:/|$))`,
  message: "Use @/modules/<name> public entry points for imports across module boundaries.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [publicApiPattern, relativeModulePattern] }],
    },
  },
  ...moduleNames.map((name) => ({
    files: [`src/modules/${name}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          publicApiPattern,
          routePattern,
          relativeModulePattern,
          {
            regex: `^@/modules/(?!(?:${[name, ...(moduleDependencies[name] ?? [])].map(escapeRegex).join("|")})(?:/|$))`,
            message: `This dependency is not declared for the ${name} module in eslint.config.mjs. Keep the module dependency graph acyclic.`,
          },
        ],
      }],
    },
  })),
  {
    files: ["src/components/**/*.{ts,tsx}", "src/config/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}", "src/infrastructure/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          routePattern,
          {
            regex: "^(?:@/modules(?:/|$)|(?:\\.\\./)+modules(?:/|$))",
            message: "Shared code and infrastructure cannot depend on feature modules.",
          },
        ],
      }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Installed agent skills are tooling, not application source.
    ".agents/skills/design-taste-frontend/**",
  ]),
]);

export default eslintConfig;
