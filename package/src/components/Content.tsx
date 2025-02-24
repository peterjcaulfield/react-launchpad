"use client"

import { useMemo } from "react";

import { useLaunchPadContext } from "../context";

import { AnimatedModal, Modal } from "./Modal";
import { SearchInput } from "./Input";
import { Error } from "./Error";
import { Results } from "./Results";
import { Preview } from "./Preview";
import { Footer } from "./Footer";


export const Content = () => {
  const { content, animate, error } = useLaunchPadContext();

  const ModalComponent = useMemo(() => animate ? AnimatedModal : Modal, [animate]);

  return (
    <ModalComponent>
      {content ? content : (
        <>
          <SearchInput />
          {error && <Error />}
          <Results />
          <Preview />
          <Footer />
        </>
      )}
    </ModalComponent>
  );
};

