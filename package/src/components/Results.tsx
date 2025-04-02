import {
  ButtonHTMLAttributes,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import classNames from "classnames";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';

import { getPublicContext, useLaunchPadContext } from "../context";
import { isSearchCommand } from "../utils";
import { Spinner } from "./Spinner";
import { Icon } from "./Icon";
import type { Command as CommandType } from "../types";

interface CommandProps {
  active: boolean;
  index: number;
}

const Command: FC<
  PropsWithChildren & ButtonHTMLAttributes<HTMLButtonElement> & CommandProps
> = ({ active, children, index, ...props }) => {
  const commandRef = useRef<HTMLButtonElement>(null);
  const { theme, focusedCommand, setFocusedCommand } = useLaunchPadContext();

  // TODO: debounce
  const onMouseMove = useCallback(() => {
    if (focusedCommand !== index) {
      setFocusedCommand(index);
    }
  }, [index, focusedCommand, setFocusedCommand]);

  return (
    <button
      {...props}
      ref={commandRef}
      onMouseMove={onMouseMove}
      aria-selected={active}
      className={classNames(theme.command.root, {
        [theme.command.active ?? ""]: active,
      }, props.className)}
    >
      {children}
    </button>
  );
};

const SearchCommandBorder = () => {
  return <motion.div
    key="search-border"
    className="rlp-h-3 rlp-border rlp-border-t-0 rlp-border-l-0 rlp-border-r-0 rlp-border-b-0.5 rlp-border-[rgba(53,55,59,1)]"
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 1 }}
    transition={{ duration: 0.1, ease: "easeOut" }}
    style={{ transformOrigin: "top" }}
  />
};

// TODO: theme (e.g searchItem: { root, border, icon? }
const SearchCommand = ({ active, index }: CommandProps) => {
  const context = useLaunchPadContext();
  const { search, onSearchSelect, error } = context;
  return (
    <div>
      <Command
        onClick={() => onSearchSelect?.(context)}
        index={index}
        active={active}
        className={
          classNames("rlp-min-h-[20px]", { "rlp-mt-3": !error })
        }
      >
        <CommandContentWrapper>
          <Icon>
            <MagnifyingGlassIcon />
          </Icon>
          {search}
        </CommandContentWrapper>
      </Command>
      <SearchCommandBorder />
    </div>
  );
};

const CommandContentWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useLaunchPadContext();

  return <div className={theme.command.wrapper}>{children}</div>
}

const CommandContent: FC<CommandType> = ({ text, icon }) => (
  <CommandContentWrapper>
    <Icon>{icon && icon}</Icon>
    {text}
  </CommandContentWrapper>
)

const Loading = () => {

  const { theme } = useLaunchPadContext();

  // TODO: onRenderLoading
  return <div role="progressbar" className={theme.loading.root}><Spinner /></div>;
}

const List = () => {
  const context = useLaunchPadContext();
  const { results, focusedCommand, onRenderCommand, resultsRef, error } = context;

  // Use the length of results rather than a hardcoded value.
  const rowVirtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => resultsRef,
    estimateSize: (index) => index === 0 && isSearchCommand(results[0]) ? error ? 48 : 60 : 36,
    overscan: 3
  });

  useEffect(() => {
    // we need to remeasure when error is set as search item height changes
    rowVirtualizer.measure();
  }, [error, rowVirtualizer, results]);

  useEffect(() => {
    rowVirtualizer.scrollToIndex(focusedCommand, { align: "auto" });
  }, [focusedCommand, rowVirtualizer]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const result = results[virtualRow.index];
          const isActive = focusedCommand === virtualRow.index;

          const content = isSearchCommand(result) ? (
            <SearchCommand key="search" active={isActive} index={virtualRow.index} />
          ) : (
            <Command
              index={virtualRow.index}
              key={result.text}
              active={isActive}
              onClick={() => result.onSelect(getPublicContext(context))}
            >
              {onRenderCommand?.(result) || <CommandContent {...result} />}
            </Command>
          );

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

export const Results = () => {
  const context = useLaunchPadContext();


  useEffect(() => {
    const { open, content, focusedCommand, setFocusedCommand, results, onSearchSelect } = context;
    if (open && content === null) {
      const onKeyDown = (e: KeyboardEvent) => {
        const { key, shiftKey } = e;
        /**
         * Handle triggering of the entry action
         */
        if (key === "Enter") {
          e.preventDefault();
          const currentlyFocusedResult = results[focusedCommand];
          // TODO: need to handle searchEntries that can be more than one
          if (isSearchCommand(currentlyFocusedResult)) {
            onSearchSelect?.(getPublicContext(context));
          } else {
            currentlyFocusedResult.onSelect(getPublicContext(context));
          }
        } else if (key === "ArrowUp" && results.length > 1) {
          e.preventDefault();
          const newFocus = mod(
            (focusedCommand === -1 ? 0 : focusedCommand) - 1,
            results.length,
          );
          setFocusedCommand(newFocus);
        } else if (key === "ArrowDown" && results.length > 1) {
          e.preventDefault();
          const newFocus = mod(focusedCommand + 1, results.length);
          setFocusedCommand(newFocus);
        } else if (key === "Tab" && results.length > 1) {
          e.preventDefault();
          e.stopPropagation();
          const newFocus = mod(
            focusedCommand + (shiftKey ? -1 : 1),
            results.length,
          );
          setFocusedCommand(newFocus);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [context]);


  return (
    <div ref={context.setResultsRef} className={context.theme.results.root} role="listbox">
      {context.loading && <Loading />}
      <List />
    </div>
  );
};
