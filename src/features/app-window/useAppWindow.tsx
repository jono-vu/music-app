import { useEffect } from "react";

import { appWindow } from "@tauri-apps/api/window";

const useAppWindow = () => {
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
};

export { useAppWindow };
