import {
  BaseDirectory,
  FileEntry,
  readDir,
  readTextFile,
} from "@tauri-apps/api/fs";
import { useEffect } from "react";

import dayjs from "dayjs";

import { getAlbumID } from "../catalogue";

const useInitAlbums = () => {
  useEffect(() => {
    async function fetchAlbums() {
      try {
        const entries = await readDir("test-albums", {
          dir: BaseDirectory.Desktop,
          recursive: true,
        });

        const albums = await convertAlbumData(entries);

        console.log(albums);

        localStorage.setItem("albums", JSON.stringify(albums));
      } catch (err) {
        console.log(err);
      }
    }

    fetchAlbums();
  }, []);
};

export { useInitAlbums };

async function convertAlbumData(entries: FileEntry[]) {
  let albumsData = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    if (entry.children && entry.name) {
      const [name, artist] = entry.name.split(" - ");

      const durationData = entry.children.filter(
        (entry) =>
          entry.name?.startsWith("duration") && entry.name.endsWith(".txt")
      )[0];
      const durationText = (await readTextFile(durationData.path)).split("\n");

      const tracks = entry.children.filter((entry) =>
        entry.name?.endsWith(".mp3")
      );

      const tracksSorted = tracks
        .sort((a, b) => getTrackNumber(a) - getTrackNumber(b))
        .map((track) => ({
          ...track,
          name: getTrackName(track),
          path: track.name || "",
        }))
        .map((track, i) => {
          return {
            duration: durationText[i],
            ...track,
          };
        });

      const cover = entry.children.filter(
        (entry) =>
          entry.name?.startsWith("cover") && !entry.name.endsWith(".mp3")
      )[0];

      const durationArray = durationText.map((item) => {
        const durationTimeArray = item.split(":");

        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (durationTimeArray.length > 2) {
          const [h, m, s] = durationTimeArray;

          hours = Number(h);
          minutes = Number(m);
          seconds = Number(s);
        } else {
          const [m, s] = durationTimeArray;

          minutes = Number(m);
          seconds = Number(s);
        }

        return dayjs.duration({ hours, minutes, seconds }).asSeconds();
      });

      const albumDuration = durationArray.reduce((a, b) => a + b, 0);
      const albumDurationFormatted =
        albumDuration > 3600
          ? dayjs.duration(albumDuration * 1000).format("H[h] mm[m]")
          : dayjs.duration(albumDuration * 1000).format("m[m] s[s]");

      const album = {
        id: getAlbumID(name, artist),
        name,
        artist,
        cover,
        path: `${name} - ${artist}`,
        duration: albumDurationFormatted,
        tracks: tracksSorted,
      };

      if (album) {
        albumsData.push(album);
      }
    }
  }

  return albumsData;
}

function getTrackNumber(track: FileEntry) {
  return Number(track.name?.split(".")[0]);
}

function getTrackName(track: FileEntry) {
  return (
    track.name?.replace(`${getTrackNumber(track)}. `, "").replace(".mp3", "") ||
    ""
  );
}
