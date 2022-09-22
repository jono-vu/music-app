import { FileEntry } from "@tauri-apps/api/fs";

export type Album = {
  id: string;
  cover: {
    path: string;
  };
  name: string;
  artist: string;
  path: string;
  tracks: Array<Track | Partial<Track>>;
};

export type Track = {
  name: string;
  path: string;
  children?: FileEntry[] | undefined;
  duration: number;
  src?: string;
  number?: number;
};

export interface TracksHashMap {
  [name: string]: Track;
}

export type AlbumHashMapValue = Pick<
  Album,
  "id" | "cover" | "name" | "artist" | "path"
> & {
  tracks: TracksHashMap;
};

export interface AlbumsHashMap {
  [id: string]: AlbumHashMapValue;
}
