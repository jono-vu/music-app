import { Album } from "../shared";

const useAlbums = () => {
  const albumsString = localStorage.getItem("albums");

  const albums: Album[] = JSON.parse(albumsString || "[]");

  return { albums };
};

export { useAlbums };
