export type Album = {
  id: string;
  cover: {
    path: string;
  };
  name: string;
  artist: string;
  duration: string;
  path: string;
  tracks: Track[];
};

export type Track = {
  name: string;
  path: string;
  duration: string;
};
