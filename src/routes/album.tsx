import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { desktopDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { Box, Flex, HStack, Icon, Image, VStack } from "@chakra-ui/react";

import {
  Emphasis,
  Mono,
  Page,
  Pause,
  Play,
  Serif,
  SoundBars,
  SoundBarsAnimated,
} from "../components";
import {
  Album as AlbumType,
  getAlbum,
  Track,
  useAlbums,
  usePlayer,
} from "../features";

const Album = () => {
  const { albums } = useAlbums();
  const { pathname } = useLocation();

  const albumID = decodeURI(pathname.replace("/album/", ""));
  const album = getAlbum(albums, albumID);

  const [cover, setCover] = useState<string | undefined>(undefined);
  const [hoveredIdx, setHoveredIdx] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function fetchCover() {
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
  });

  if (!album)
    return (
      <Page>
        <Box />
      </Page>
    );

  return (
    <Page>
      <Flex
        justifyContent="center"
        alignItems="center"
        flexWrap={"wrap"}
        columnGap={16}
        rowGap={8}
      >
        <Image
          fallback={<Box bg="brand.darkBg" h={300} w={300} />}
          src={cover}
          h={300}
          w={300}
        />

        <VStack justifyContent="flex-start" alignItems="stretch">
          <VStack alignItems="stretch">
            <Serif>{album.artist}</Serif>
            <Emphasis fontSize={20 + 400 / album.name.length}>
              {album.name}
            </Emphasis>
          </VStack>

          <VStack alignItems="stretch">
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
                  <TrackRow
                    {...{ track, album, isHovered: hoveredIdx === i }}
                  />
                </Box>
              );
            })}
          </VStack>
        </VStack>
      </Flex>
    </Page>
  );
};

export { Album };

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
    <HStack justifyContent="space-between">
      <HStack>
        <Serif>{trackNumber + 1}.</Serif>
        <Serif>{track.name}</Serif>
      </HStack>

      <Actions />
    </HStack>
  );
};
