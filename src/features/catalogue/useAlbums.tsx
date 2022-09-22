import { Album, AlbumsHashMap, getStore, StoreKeys } from "../shared";

const useAlbums = () => {
  const albumsHashMap = getStore<AlbumsHashMap>(StoreKeys.albums);

  const albums = convertHashMapToAlbums(albumsHashMap);

  return { albums };
};

export { useAlbums };

function convertHashMapToArray<TData>(object: { [key: string]: TData }) {
  const array: TData[] = Object.values(object);

  return array;
}

function convertHashMapToAlbums(object: AlbumsHashMap) {
  return convertHashMapToArray(object).map(({ tracks, ...item }) => ({
    ...item,
    tracks: convertHashMapToArray(tracks),
  })) as Array<Album>;
}
