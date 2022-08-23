import { Box, BoxProps } from "@chakra-ui/react";

interface IconProps extends BoxProps {
  size?: number;
  children: React.ReactNode;
}

const Icon: React.FC<IconProps> = ({ size = 5, children, ...props }) => {
  return (
    <Box
      w={size}
      h={size}
      _hover={{ opacity: 0.8 }}
      _active={{ opacity: 0.6 }}
      cursor="pointer"
      {...props}
    >
      {children}
    </Box>
  );
};

export { Icon };
