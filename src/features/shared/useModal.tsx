import { useRecoilState } from "recoil";

import { modalState } from "../../features";

const useModal = () => {
  const [modal, setModal] = useRecoilState(modalState);

  function open({ children }: { children: React.ReactNode }) {
    setModal({ children });
  }

  function close() {
    setModal({ children: null });
  }

  return { open, close, children: modal.children };
};

export { useModal };
