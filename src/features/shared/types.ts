export type Album = {
  id: string;
  cover: {
    path: string;
  };
  name: string;
  artist: string;
  path: string;
  tracks: Track[];
};

export type Track = {
  name: string;
  path: string;
  src?: string;
  duration: number;
};
