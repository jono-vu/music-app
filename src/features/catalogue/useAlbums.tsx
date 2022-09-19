import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import { Album } from "../shared";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

const useAlbums = () => {
  const albumsString = localStorage.getItem("albums");

  const albums: Album[] = JSON.parse(albumsString || "[]");

  return { albums };
};

export { useAlbums };
