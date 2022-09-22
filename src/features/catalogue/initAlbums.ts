import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";
import { desktopDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import {
  Album,
  AlbumHashMapValue,
  AlbumsHashMap,
  getAlbumID,
  getStore,
  setStore,
  StoreKeys,
  Track,
  TracksHashMap,
} from "../../features";

import { normalisePath } from "../../utils";

async function initAlbums() {
  try {
    const entries = await readDir("test-albums", {
      dir: BaseDirectory.Desktop,
      recursive: true,
    });

    const albums = await convertAlbumData(entries);
    const albumsHashMap = convertAlbumsToHashMap(albums);

    setStore(StoreKeys.albums, albumsHashMap);
  } catch (err) {
    console.log(err);
  }
}

export { initAlbums };

async function convertAlbumData(entries: FileEntry[]) {
  let albumsData = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    if (entry.children && entry.name) {
      const [name, artist] = entry.name.split(" - ");
      const albumPath = `${name} - ${artist}`;
      const albumID = `${name}-${artist}`;

      const tracks = entry.children.filter((entry) =>
        entry.name?.endsWith(".mp3")
      );

      const tracksWithNumbers = getTrackNumbers(tracks);

      const tracksWithSrc = await getTracksSrc(albumPath, tracksWithNumbers);

      const tracksWithDuration = await getTracksDuration(
        albumID,
        tracksWithSrc
      );

      const cover = entry.children.filter(
        (entry) =>
          entry.name?.startsWith("cover") && !entry.name.endsWith(".mp3")
      )[0];

      const album = {
        id: getAlbumID(name, artist),
        name,
        artist,
        cover,
        path: `${name} - ${artist}`,
        tracks: tracksWithDuration,
      };

      if (album) {
        albumsData.push(album);
      }
    }
  }

  return albumsData;
}

function getTrackNumber(track: Partial<Track>) {
  return Number(track.name?.split(".")[0]);
}

function getTrackName(track: Partial<Track>) {
  return (
    track.name?.replace(`${getTrackNumber(track)}. `, "").replace(".mp3", "") ||
    ""
  );
}

function getTrackNumbers(tracks: Array<Partial<Track>>) {
  const tracksSorted = tracks.sort(
    (a, b) => getTrackNumber(a) - getTrackNumber(b)
  );

  const tracksWithNumbers = tracksSorted.map((track, i) => ({
    ...track,
    name: getTrackName(track),
    path: track.name || "",
    number: i,
  }));

  return tracksWithNumbers;
}

async function getTracksSrc(albumPath: string, tracks: Array<Partial<Track>>) {
  let tracksWithSrc = [];

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];

    try {
      const fileDir = await join(
        await desktopDir(),
        "test-albums",
        albumPath,
        track.path || ""
      );

      const file = convertFileSrc(fileDir);
      const src = normalisePath(file);

      tracksWithSrc.push({ src, ...track });
    } catch (err) {
      console.log(err);

      tracksWithSrc.push({ src: undefined, ...track });
    }
  }

  return tracksWithSrc;
}

async function getTracksDuration(
  albumID: string,
  tracks: Array<Partial<Track>>
) {
  const albums = getStore<AlbumsHashMap>(StoreKeys.albums);

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];

    const duration = albums[albumID]?.tracks[track.name || ""]?.duration;

    if (!duration) {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.src = track.src || "";

      audio.addEventListener(
        "loadedmetadata",
        () => {
          const albums = getStore<AlbumsHashMap>(StoreKeys.albums);
          let newAlbums = albums;

          if (!audio.duration) return;

          newAlbums[albumID].tracks[track.name || ""].duration = audio.duration;
          setStore(StoreKeys.albums, newAlbums);
        },
        true
      );
    }
  }

  return tracks;
}

function convertArrToHashMap<TInput, TData>(
  array: TInput[],
  key: keyof TInput
) {
  return array.reduce((a, item) => {
    return { ...a, [item[key] as unknown as string]: item };
  }, {}) as TData;
}

function convertAlbumsToHashMap(albums: Album[]) {
  const albumsInput = albums.map(({ tracks, ...album }) => {
    const tracksHashMap = convertArrToHashMap<Track, TracksHashMap>(
      tracks as Track[],
      "name"
    );

    return {
      ...album,
      tracks: tracksHashMap,
    };
  });

  return convertArrToHashMap<AlbumHashMapValue, AlbumsHashMap>(
    albumsInput,
    "id"
  );
}