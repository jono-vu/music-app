import {
  BaseDirectory,
  FileEntry,
  readDir,
  readTextFile,
} from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";

import { getAlbumID } from "../catalogue";
import { Album } from "../shared";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

const useAlbums = () => {
  const [data, setData] = useState<FileEntry[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const entries = await readDir("test-albums", {
          dir: BaseDirectory.Desktop,
          recursive: true,
        });

        setData(entries);
      } catch (err) {
        console.log(err);
      }
    }

    fetchAlbums();
  }, []);

  useEffect(() => {
    async function convertAlbumData() {
      let albumsData = [];

      for (let i = 0; i < data.length; i++) {
        const entry = data[i];

        if (entry.children && entry.name) {
          const [name, artist] = entry.name.split(" - ");

          const durationData = entry.children.filter(
            (entry) =>
              entry.name?.startsWith("duration") && entry.name.endsWith(".txt")
          )[0];
          const durationText = (await readTextFile(durationData.path)).split(
            "\n"
          );

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
              ? dayjs.duration(albumDuration * 1000).format("h:mm:ss")
              : dayjs.duration(albumDuration * 1000).format("m:ss");

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

        albumsData.length > 0 && setAlbums(albumsData);
      }
    }

    data && convertAlbumData();
  }, [data]);

  return { albums };
};

export { useAlbums };

function getTrackNumber(track: FileEntry) {
  return Number(track.name?.split(".")[0]);
}

function getTrackName(track: FileEntry) {
  return (
    track.name?.replace(`${getTrackNumber(track)}. `, "").replace(".mp3", "") ||
    ""
  );
}
