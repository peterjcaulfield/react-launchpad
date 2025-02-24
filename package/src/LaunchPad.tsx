import { FC } from "react";

import { LaunchPadProps } from "./types";
import { LaunchPadContextProvider } from "./context";
import { Content } from "./components";

export const LaunchPad: FC<LaunchPadProps> = (props) => {
  return (
    <LaunchPadContextProvider {...props}>
      <Content />
    </LaunchPadContextProvider>
  );
};
