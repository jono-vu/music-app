import { Text } from "@chakra-ui/react";

const ellipsisOptions = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "clip",
};

type Any = any;

interface TypographyProps extends Any {
  ellipsis?: boolean;
}

const Serif = ({ ellipsis, ...props }: TypographyProps) => (
  <Text
    fontFamily="alpina"
    letterSpacing={0.3}
    {...(ellipsis && { ...(ellipsisOptions as any) })}
    {...props}
  />
);

const Mono = ({ ellipsis, ...props }: TypographyProps) => (
  <Text
    fontFamily="flexa"
    {...(ellipsis && { ...(ellipsisOptions as any) })}
    {...props}
  />
);

const Emphasis = ({ ellipsis, ...props }: TypographyProps) => (
  <Text
    fontFamily="manuka"
    fontSize="100pt"
    lineHeight={1.1}
    {...(ellipsis && { ...(ellipsisOptions as any) })}
    {...props}
  />
);

export { Serif, Mono, Emphasis };
