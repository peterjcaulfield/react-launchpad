"use client";

import { useRef, useEffect, FC, PropsWithChildren, useState, useCallback } from "react";
import { useLaunchPadContext } from "../context";
import { AnimatePresence, motion } from "framer-motion";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";


// TODO: theme
export const Modal: FC<PropsWithChildren> = ({
  children,
}) => {
  const { open, setOpen, theme } = useLaunchPadContext();

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center text-center sm:items-center">
          <DialogPanel
            transition
            className={`relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 ${theme.modal.root}`}
          >
            <div>{children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};


export const AnimatedModal: FC<PropsWithChildren> = ({ children }) => {
  const { results, open } = useLaunchPadContext();
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const previousHeight = useRef<number | null>(null);
  const firstHeightChangeTriggered = useRef(false);
  const [observerActive, setObserverActive] = useState(false);

  useEffect(() => {
    // Only start observing after the modal's open animation completes.
    if (!observerActive || !open) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Measure and set the initial height once the modal is fully rendered.
    if (previousHeight.current === null) {
      const initialHeight = inner.offsetHeight;
      previousHeight.current = initialHeight;
      outer.style.height = `${initialHeight}px`;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!open) return;
      for (let entry of entries) {
        const newHeight = entry.contentRect.height;

        if (previousHeight.current === null) {
          previousHeight.current = newHeight;
          outer.style.height = `${newHeight}px`;
          return;
        }

        // For the very first height change, force a reflow before animating.
        if (!firstHeightChangeTriggered.current) {
          firstHeightChangeTriggered.current = true;
          // Force reflow by reading the offsetHeight
          void outer.offsetHeight;
          outer.animate(
            [
              { height: `${previousHeight.current}px` },
              { height: `${newHeight}px` }
            ],
            {
              duration: 150,
              easing: "ease-out",
              fill: "forwards"
            }
          );
        } else {
          // Subsequent height changes animate immediately.
          outer.animate(
            [
              { height: `${previousHeight.current}px` },
              { height: `${newHeight}px` }
            ],
            {
              duration: 100,
              easing: "ease-out",
              fill: "forwards"
            }
          );
        }
        previousHeight.current = newHeight;
      }
    });

    resizeObserver.observe(inner);
    return () => {
      resizeObserver.disconnect();
    };
  }, [observerActive, results, open]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Modal>
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 20,
              duration: 0.25,
            }}
            // Only after the open animation completes do we enable the observer.
            onAnimationComplete={() => setObserverActive(true)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Height animation wrapper */}
              <div ref={outerRef} className="overflow-hidden">
                <div ref={innerRef}>{children}</div>
              </div>
            </motion.div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};
