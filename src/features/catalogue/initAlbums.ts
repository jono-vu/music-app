import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";
import { desktopDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { Album, getAlbumID, Track } from "../../features";

import { normalisePath } from "../../utils";

interface TrackConstructor {
  name: string;
  path: string;
  children?: FileEntry[] | undefined;
  src?: string;
  duration?: number;
  number: number;
}

async function initAlbums() {
  try {
    const entries = await readDir("test-albums", {
      dir: BaseDirectory.Desktop,
      recursive: true,
    });

    const albums = await convertAlbumData(entries);
    localStorage.setItem("albums", JSON.stringify(albums));
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

function getTrackNumber(track: Partial<TrackConstructor>) {
  return Number(track.name?.split(".")[0]);
}

function getTrackName(track: Partial<TrackConstructor>) {
  return (
    track.name?.replace(`${getTrackNumber(track)}. `, "").replace(".mp3", "") ||
    ""
  );
}

function getTrackNumbers(tracks: Array<Partial<TrackConstructor>>) {
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

async function getTracksSrc(
  albumPath: string,
  tracks: Array<Partial<TrackConstructor>>
) {
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
  tracks: Array<Partial<TrackConstructor>>
) {
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];

    const audio = new Audio();
    audio.preload = "metadata";

    audio.src = track.src || "";
    audio.addEventListener(
      "loadedmetadata",
      (e) => {
        const albums: Album[] = JSON.parse(
          localStorage.getItem("albums") || "[]"
        );

        let newAlbums: Album[] = albums;

        albums.forEach((album, albumIdx) => {
          if (album.id === albumID) {
            tracks.forEach((item, trackIdx) => {
              if (track.name === item.name) {
                console.log(audio.duration);

                newAlbums[albumIdx].tracks[trackIdx] = {
                  ...(track as Track),
                  duration: audio.duration,
                };
              }
            });
          }
        });

        localStorage.setItem("albums", JSON.stringify(newAlbums));
      },
      true
    );
  }

  return tracks;
}
