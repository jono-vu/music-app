import { useEffect, useState } from "react";

import { Slider, SliderFilledTrack, SliderTrack } from "@chakra-ui/react";

import { usePlayer } from "../../features";
import { useInterval } from "../../utils";

import dayjs from "dayjs";
import dayjsDuration from "dayjs/plugin/duration";

dayjs.extend(dayjsDuration);

const Seeker = ({ ...props }) => {
  const { audioRef, seek } = usePlayer();

  const duration = audioRef?.current.duration;
  const currentTime = audioRef?.current.currentTime;

  const [sliderValue, setSliderValue] = useState<number>(0);

  useEffect(() => {
    currentTime &&
      duration &&
      percentComplete &&
      setSliderValue(percentComplete);
  }, []);

  useInterval(() => {
    currentTime &&
      duration &&
      percentComplete &&
      setSliderValue(percentComplete);
  }, 1000);

  if (!currentTime || !duration) return null;

  const percentComplete = (currentTime * 100) / duration;

  return (
    <Slider
      w="full"
      min={0}
      max={100}
      defaultValue={percentComplete}
      onChange={(value) => {
        seek((value * duration) / 100);
        setSliderValue(value);
      }}
      value={sliderValue}
      {...props}
    >
      <SliderTrack bg="brand.darkBg">
        <SliderFilledTrack bg="brand.text" />
      </SliderTrack>
    </Slider>
  );
};

export { Seeker };
