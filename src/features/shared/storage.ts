import { parse, stringify } from "../../utils";

const store = localStorage;

enum StoreKeys {
  albums = "ALBUMS",
}

function getStore<TData>(key: string, fallback?: TData) {
  const value = store.getItem(key);

  if (!value) return fallback || ({} as TData);

  return parse(value) as TData;
}

function setStore(key: string, data: any) {
  store.setItem(key, stringify(data));
}

export { getStore, setStore, StoreKeys };
