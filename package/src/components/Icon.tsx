"use client";

import { FC, PropsWithChildren } from "react";
import { useLaunchPadContext } from "../context";

export const Icon: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useLaunchPadContext();
  return <div className={theme.icon}>{children}</div>;
};
