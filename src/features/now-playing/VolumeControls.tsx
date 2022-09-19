import { useEffect, useState } from "react";

import {
  HStack,
  Slider,
  SliderFilledTrack,
  SliderTrack,
} from "@chakra-ui/react";

import { Icon, Muted, Volume } from "../../components";
import { usePlayer } from "./usePlayer";

import dayjs from "dayjs";
import dayjsDuration from "dayjs/plugin/duration";

dayjs.extend(dayjsDuration);

const VolumeControls: React.FC = ({ ...props }) => {
  const { audioRef, muted, setMuted, volume, setVolume } = usePlayer();

  const [value, setValue] = useState<number>(volume * 100);

  useEffect(() => {
    setVolume(value);
  }, [value]);

  useEffect(() => {
    if (audioRef) {
      if (muted) {
        audioRef.current.muted = true;
      } else {
        audioRef.current.muted = false;
      }
    }
  }, [audioRef, muted]);

  return (
    <HStack {...props}>
      <Icon
        size={5}
        onClick={() => {
          setMuted(!muted);
        }}
      >
        {muted || value === 0 ? <Muted /> : <Volume />}
      </Icon>

      <Slider
        w="140px"
        min={0}
        max={100}
        value={muted ? 0 : value}
        onChange={(v) => {
          setMuted(false);
          setValue(v);
        }}
        onChangeEnd={(v) => {
          setMuted(false);
          setValue(v);
        }}
      >
        <SliderTrack bg="brand.darkBg">
          <SliderFilledTrack bg="brand.text" />
        </SliderTrack>
      </Slider>
    </HStack>
  );
};

export { VolumeControls };
