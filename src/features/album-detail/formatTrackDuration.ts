import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

function formatTrackDuration(duration: number) {
  return dayjs.duration(duration, "seconds").format("m:ss");
}

export { formatTrackDuration };
