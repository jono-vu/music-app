import { useState } from "react";

import { Flex, Grid, HStack } from "@chakra-ui/react";

import {
  Icon,
  Mono,
  Next,
  Pause,
  Play,
  SoundBars,
  SoundBarsAnimated,
} from "../../components";
import {
  AlbumDetail,
  Seeker,
  useModal,
  usePlayer,
  VolumeControls,
} from "../../features";
import { useInterval } from "../../utils";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const Player = () => {
  const { open } = useModal();
  const { audioRef, queue, queueIdx, isPlaying, playPause, next } = usePlayer();

  const [isHovered, setHovered] = useState<boolean>(false);
  const [trackPosition, setTrackPosition] = useState<string>("0:00");

  useInterval(() => {
    if (!audioRef) return;

    setTrackPosition(
      dayjs.duration(audioRef.current.currentTime * 1000).format("m:ss")
    );
  }, 1000);

  const track = queue[queueIdx]?.track;

  return (
    <Grid
      templateColumns="2fr 1fr"
      alignItems="center"
      bg="brand.bg"
      color="brand.text"
      gap={2}
      py={3}
      px={4}
      width="full"
      bottom={0}
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <Grid gridTemplateColumns="1fr 1fr" gap={4}>
        <Flex gap={4} alignItems="flex-end">
          <Icon size={5}>
            {isPlaying ? <SoundBarsAnimated /> : <SoundBars />}
          </Icon>

          <Mono
            ellipsis
            _hover={{ textDecoration: "underline" }}
            onClick={() => {
              open({
                children: (
                  <AlbumDetail albumID={queue[queueIdx]?.albumID || ""} />
                ),
              });
            }}
          >
            {queue[queueIdx]?.trackNumber || 0 + 1}. {track?.name}
          </Mono>
        </Flex>

        {isHovered ? (
          <HStack justifyContent={"flex-end"}>
            <Icon
              size={6}
              onClick={() => {
                playPause();
              }}
            >
              {!isPlaying ? <Play /> : <Pause />}
            </Icon>
            <Icon
              size={6}
              onClick={() => {
                next(queue, queueIdx);
              }}
            >
              <Next />
            </Icon>
          </HStack>
        ) : (
          <div />
        )}
      </Grid>

      <Grid gridTemplateColumns="1fr auto auto" gap={8}>
        <div />
        {isHovered ? <VolumeControls /> : <div />}
        <Mono>{trackPosition}</Mono>
      </Grid>
    </Grid>
  );
};

export { Player };
