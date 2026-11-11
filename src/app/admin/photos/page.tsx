import { getProductPhotos } from "@/modules/catalog/server";
import PhotosManager from "./photos-manager";

export const instant = false;

export default async function AdminPhotosPage() {
  const photos = await getProductPhotos();

  return <PhotosManager initialPhotos={photos} />;
}
