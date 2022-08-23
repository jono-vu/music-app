import { useEffect, useState } from "react";

import {
  HStack,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  StackProps,
} from "@chakra-ui/react";

import { usePlayer } from "./usePlayer";
import { Icon, Muted, Volume } from "../../components";

import dayjs from "dayjs";
import dayjsDuration from "dayjs/plugin/duration";

dayjs.extend(dayjsDuration);

interface VolumeControlProps extends StackProps {
  show?: boolean;
}

const VolumeControls: React.FC<VolumeControlProps> = ({ show, ...props }) => {
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
    <HStack justify="right" {...props}>
      <Icon
        size={4}
        onClick={() => {
          setMuted(!muted);
        }}
      >
        {muted || value === 0 ? <Muted /> : <Volume />}
      </Icon>

      {show && (
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
      )}
    </HStack>
  );
};

export { VolumeControls };
