"use client";

import { useLaunchPadContext } from "../context";

export const Footer = () => {
  const { theme, footerContent } = useLaunchPadContext();
  return <div className={theme.footer.root}>{footerContent}</div>;
};

