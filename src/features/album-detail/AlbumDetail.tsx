import { useEffect, useState } from "react";

import { desktopDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { Box, Flex, Grid, HStack, Icon, Image, VStack } from "@chakra-ui/react";

import {
  Mono,
  Pause,
  Play,
  SoundBars,
  SoundBarsAnimated,
} from "../../components";
import {
  Album as AlbumType,
  getAlbum,
  Track,
  useAlbums,
  usePlayer,
} from "../../features";

const AlbumDetail = ({ albumID }: { albumID: string }) => {
  const { albums } = useAlbums();

  const album = getAlbum(albums, albumID);

  const [cover, setCover] = useState<string | undefined>(undefined);
  const [hoveredIdx, setHoveredIdx] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchCover() {
      if (!album?.path) return;

      try {
        const fileDir = await join(
          await desktopDir(),
          "test-albums",
          album?.path || "",
          "cover.jpeg"
        );

        const file = convertFileSrc(fileDir, "asset");

        setCover(file);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCover();
  }, [album?.path]);

  if (!album) return <Box />;

  return (
    <Grid gridTemplateRows="auto auto 1fr" gap={6} pt={8} height="full">
      <Image
        mx={8}
        fallback={<Box bg="brand.darkBg" h={150} w={150} />}
        src={cover}
        h={150}
        w={150}
        objectFit="cover"
      />

      <HStack justifyContent="space-between" alignItems="flex-start" mx={8}>
        <VStack alignItems="flex-start">
          <Mono lineHeight={1.2}>{album.name}</Mono>
          <Mono lineHeight={1.2} fontSize="xs">
            {album.artist}
          </Mono>
        </VStack>
        <Mono>{album.duration}</Mono>
      </HStack>

      <Flex
        flexDirection="column"
        alignItems="stretch"
        px={6}
        pb={8}
        gap={0}
        overflowY="auto"
      >
        {album.tracks.map((track, i) => {
          return (
            <Box
              key={track.path}
              onMouseOver={() => {
                setHoveredIdx(i);
              }}
              onMouseLeave={() => {
                setHoveredIdx(undefined);
              }}
            >
              <TrackRow {...{ track, album, isHovered: hoveredIdx === i }} />
            </Box>
          );
        })}
      </Flex>
    </Grid>
  );
};

export { AlbumDetail };

const TrackRow = ({
  track,
  album,
  isHovered,
}: {
  track: Track;
  album: AlbumType;
  isHovered: boolean;
}) => {
  const { playPause, isPlaying, play, queue, queueIdx } = usePlayer();

  const [isClicked, setClicked] = useState<boolean>(false);

  const trackNumber = album.tracks
    .map((item, i) => item.path === track.path && i)
    .filter((item) => typeof item === `number`)[0] as number;

  const isTrackPlaying = queue[queueIdx]?.track.path === track.path;

  const Actions = () => {
    if (!isHovered) {
      if (!isTrackPlaying) {
        return <Mono>{track.duration}</Mono>;
      }
      return isPlaying ? <SoundBarsAnimated /> : <SoundBars />;
    }

    return (
      <Icon
        _active={{ opacity: 0.6 }}
        as={isTrackPlaying && isPlaying ? Pause : Play}
        w={5}
        h={5}
        onClick={() => {
          if (!isTrackPlaying) {
            play(album.id, trackNumber);
            return;
          }

          playPause();
        }}
      />
    );
  };

  return (
    <Grid
      gridTemplateColumns="1fr auto"
      py={1}
      px={2}
      {...{ _hover: { bg: isClicked ? "whiteAlpha.50" : "whiteAlpha.100" } }}
      onClick={() => {
        if (isClicked) {
          setClicked(false);

          if (!isTrackPlaying) {
            play(album.id, trackNumber);
            return;
          }

          playPause();
          return;
        }

        setClicked(true);
      }}
      onMouseLeave={() => {
        setClicked(false);
      }}
    >
      <HStack>
        <Mono>{trackNumber + 1}.</Mono>
        <Mono>{track.name}</Mono>
      </HStack>

      <Actions />
    </Grid>
  );
};
