import { Box, HStack } from "@chakra-ui/react";

const TitleBar = () => {
  return (
    <HStack data-tauri-drag-region gap={0} p={2}>
      <Box w={3} h={3} rounded="full" id="titlebar-close" bg="red.500" />
      <Box w={3} h={3} rounded="full" id="titlebar-minimize" bg="yellow.500" />
    </HStack>
  );
};

export { TitleBar };
