import { convertHashMapToArray } from "../../utils";
import { Album, AlbumsHashMap, getStore, StoreKeys } from "../shared";

const useAlbums = () => {
  const albumsHashMap = getStore<AlbumsHashMap>(StoreKeys.albums);

  const albums = convertHashMapToAlbums(albumsHashMap);

  return { albums };
};

export { useAlbums };

function convertHashMapToAlbums(object: AlbumsHashMap) {
  return convertHashMapToArray(object).map(({ tracks, ...item }) => ({
    ...item,
    tracks: convertHashMapToArray(tracks),
  })) as Array<Album>;
}
