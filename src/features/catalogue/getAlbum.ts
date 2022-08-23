import { Album } from "../shared";

function getAlbum(albums: Album[], id: string) {
  const album = albums.find((album) => album.id === id);

  return album;
}

export { getAlbum };
