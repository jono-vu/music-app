import { Album } from "../shared";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

function formatAlbumDuration(album: Album) {
  const albumDuration = album.tracks.reduce((a, b) => a + (b.duration || 0), 0);

  const albumDurationFormatted =
    albumDuration > 3600
      ? dayjs.duration(albumDuration * 1000).format("H[h] mm[m]")
      : dayjs.duration(albumDuration * 1000).format("m[m] s[s]");

  return albumDurationFormatted;
}

export { formatAlbumDuration };
