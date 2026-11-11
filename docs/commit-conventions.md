# Commit conventions

Agents must follow these conventions whenever committing changes in this repository.

## Message format

```text
action: message
```

Use a lowercase action, a colon, one space, and a concise description of the
resulting change. Keep the subject within 72 characters when practical. Use an
imperative verb such as "add", "fix", "update", or "remove"; omit a trailing period.
Do not add scopes, emojis, or extra prefixes to the subject. Honor an exact commit
message supplied by the user.

## Actions

| Action | Use for |
| --- | --- |
| `feat` | New user-facing functionality |
| `fix` | Correcting a bug or broken behavior |
| `docs` | Documentation, skills, and agent guidance |
| `style` | Formatting changes without behavior changes |
| `refactor` | Restructuring code without changing its intended behavior |
| `perf` | Improving runtime or build performance |
| `test` | Adding or correcting tests |
| `build` | Dependencies, build tooling, or package configuration |
| `ci` | Continuous integration workflows |
| `chore` | Repository maintenance and initial setup |
| `revert` | Reverting an earlier commit |

Choose the action for the primary outcome. A new UI feature can include its
required dependencies, tests, and documentation under `feat`. A visual bug fix
uses `fix`; a new visual capability uses `feat`. Reserve `style` for code formatting.

## Examples

```text
chore: initial setup
feat: add product collection filters
fix: correct mobile navigation positioning
docs: add commit conventions for agents
refactor: extract shared product card
build: update Next.js dependencies
```

## Commit workflow

- Commit when the user requests it or the active task explicitly includes committing. These conventions alone do not authorize automatic commits or pushes.
- Inspect `git status` and the diff before staging. Stage the files or hunks belonging to the requested change, preserving unrelated work.
- Keep each commit focused on one coherent outcome. Split unrelated setup, features, and fixes when they can stand independently; keep required code, tests, assets, and documentation together.
- Follow the user's requested grouping and messages. Each commit should be understandable from its own diff and subject.
- Run checks appropriate to the change and review the staged diff, including `git diff --cached --check`. Do not claim checks that were not run or bypass failing hooks to force a commit.
- Add an optional body, separated by a blank line, when rationale, migration details, breaking behavior, or verification limits materially help a future reader. The subject still follows `action: message`.
- Do not amend, rewrite history, or push unless the user or active task authorizes it.
- After committing, report the short hash and subject, and state whether any changes remain uncommitted.
