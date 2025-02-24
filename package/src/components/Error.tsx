"use client";

import { useLaunchPadContext } from "../context";

export const Error = () => {
  const { error, theme } = useLaunchPadContext();

  return <div role="alert" className={theme.error.root}>{error}</div>;
};
