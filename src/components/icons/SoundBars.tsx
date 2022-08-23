import { Box, Flex } from "@chakra-ui/react";

const SoundBars = ({ ...props }) => {
  return (
    <Flex gap={1} {...props} alignItems="flex-end" h={5}>
      <Box bg="white" h="33%" w="5px" />
      <Box bg="white" h="full" w="5px" />
      <Box bg="white" h="67%" w="5px" />
    </Flex>
  );
};

const SoundBarsAnimated = ({ ...props }) => {
  return (
    <Flex gap={1} {...props} alignItems="flex-end" h={5}>
      <Box
        bg="white"
        h="full"
        w="5px"
        className="animation-soundbars"
        style={{ animationDuration: "0.8s" }}
      />
      <Box bg="white" h="full" w="5px" className="animation-soundbars" />
      <Box
        bg="white"
        h="full"
        w="5px"
        className="animation-soundbars"
        style={{ animationDuration: "0.9s" }}
      />
    </Flex>
  );
};

export { SoundBars, SoundBarsAnimated };
