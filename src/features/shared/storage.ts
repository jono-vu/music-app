import { parse, stringify } from "../../utils";

const store = localStorage;

enum StoreKeys {
  albums = "ALBUMS",
  albumDirectory = "ALBUM_DIRECTORY",
}

function getStore<TData>(key: string, fallback?: TData) {
  const value = store.getItem(key);

  if (!value) return fallback || ({} as TData);

  return parse(value) as TData;
}

function setStore<TData>(key: string, data: TData) {
  store.setItem(key, stringify(data));
}

export { getStore, setStore, StoreKeys };
