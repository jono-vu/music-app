import { useState } from "react";

import { Box, Grid } from "@chakra-ui/react";

import { Emphasis, Mono, Page } from "../components";
import { Album, Compartment, Spine, useAlbums } from "../features";
import { arrayFrom } from "../utils";

const Catalogue = () => {
  const { albums } = useAlbums();

  const groupedAlbums = groupAlbums(albums);

  const [hoveredAlbum, setHoveredAlbum] = useState<string | undefined>(
    undefined
  );

  const columns = 3;
  const emptyCompartments = arrayFrom(
    columns - (groupedAlbums.length % columns)
  );

  return (
    <Page>
      <Grid templateRows="auto 1fr" h="100%">
        <Grid alignItems="end" mt={8}>
          <Emphasis as="h1">Catalogue.</Emphasis>
        </Grid>

        <Box as="section" mt={2}>
          <Grid templateColumns={`repeat(${columns}, 1fr)`}>
            {groupedAlbums.map(({ key, albums }) => {
              return (
                <Compartment {...{ key }}>
                  <Mono
                    my={1}
                    mx={2}
                    color={hoveredAlbum ? "brand.bg" : "brand.text"}
                    // transition="ease 0.1s"
                  >
                    /{key.toLowerCase()}
                  </Mono>

                  {albums.map((album) => {
                    const isHovered = hoveredAlbum === album.id;

                    return (
                      <Box
                        key={album.id}
                        onMouseOver={() => {
                          setHoveredAlbum(album.id);
                        }}
                        onMouseLeave={() => {
                          if (isHovered) {
                            setHoveredAlbum(undefined);
                          }
                        }}
                      >
                        <Spine
                          data={album}
                          active={isHovered || hoveredAlbum === undefined}
                        />
                      </Box>
                    );
                  })}
                </Compartment>
              );
            })}

            {emptyCompartments.map((_, i) => {
              return <Compartment key={i} />;
            })}
          </Grid>
        </Box>
      </Grid>
    </Page>
  );
};

export { Catalogue };

function groupAlbums(data: Album[]) {
  const dataWithAlphabetKey = data.map((album) => ({
    key: album.name[0].toUpperCase(),
    ...album,
  }));

  let dataGroupedByAlphabetKey: any = {};

  dataWithAlphabetKey.forEach(({ key, ...album }) => {
    if (!dataGroupedByAlphabetKey[key]) {
      dataGroupedByAlphabetKey[key] = [];
    }

    dataGroupedByAlphabetKey[key].push(album);
  });

  const dataSorted = Object.entries(dataGroupedByAlphabetKey)
    .map(([key, albums]) => ({ key, albums: albums as Album[] }))
    .sort((a, b) => a.key.localeCompare(b.key));

  return dataSorted;
}
