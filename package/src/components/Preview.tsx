"use client";

import { useLaunchPadContext } from "../context";

export const Preview = () => {
  const { focusedCommand, results } = useLaunchPadContext();

  if (focusedCommand && results[0].preview) {
    const ResultPreview = results[0].preview;
    return <ResultPreview />;
  }
  return null;
};
