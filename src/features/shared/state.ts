import React from "react";
import { atom } from "recoil";

export type ModalType = {
  children: React.ReactNode;
};

const modalState = atom<ModalType>({
  key: "modalState",
  default: {
    children: null,
  },
});

export { modalState };
