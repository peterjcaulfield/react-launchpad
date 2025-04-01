import { FC, PropsWithChildren } from "react";

import { LaunchPadProps } from "./types";
import { LaunchPadContextProvider } from "./context";
import { Content } from "./components";

export const LaunchPad: FC<PropsWithChildren<LaunchPadProps>> = ({ children, ...launchPadProps }) => {
  return (
    <LaunchPadContextProvider {...launchPadProps}>
      <Content />
      {children}
    </LaunchPadContextProvider>
  );
};
