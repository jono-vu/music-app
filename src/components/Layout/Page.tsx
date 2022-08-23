import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { Box, Center, Grid, HStack } from "@chakra-ui/react";

import { Footer } from "../Layout";
import { Mono } from "../Typography";

import { appWindow } from "@tauri-apps/api/window";

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (document) {
      document
        .getElementById("titlebar-minimize")
        ?.addEventListener("click", () => appWindow.minimize());
      document
        .getElementById("titlebar-close")
        ?.addEventListener("click", () => appWindow.close());
    }
  }, []);

  return (
    <Grid
      position="absolute"
      templateRows="auto auto 1fr auto"
      w="full"
      h="100vh"
      color="brand.text"
      bg="brand.bg"
    >
      <HStack data-tauri-drag-region gap={0} p={2}>
        <Box w={3} h={3} rounded="full" id="titlebar-close" bg="red.500" />
        <Box
          w={3}
          h={3}
          rounded="full"
          id="titlebar-minimize"
          bg="yellow.500"
        />
      </HStack>

      <Center p={1}>
        <HStack gap={6}>
          <Link to="/catalogue">
            <Mono>/catalogue</Mono>
          </Link>
          <Link to="/now-playing">
            <Mono>/now-playing</Mono>
          </Link>
        </HStack>
      </Center>
      <Grid overflowY="auto" p={4}>
        {children}
      </Grid>
      <Footer />
    </Grid>
  );
};

export { Page };
