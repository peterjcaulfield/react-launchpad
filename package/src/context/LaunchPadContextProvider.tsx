import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";

import { theme as defaultTheme } from "../theme/slack";
import {
  LaunchPadProps,
  LaunchPadInnerContext,
  LaunchPadContext as PublicLaunchPadContext,
} from "../types";
import { useResults, useControllable } from "./hooks";

const LaunchPadContext = createContext<LaunchPadInnerContext | null>(null);

const defaultCommands = [];
const defaultInitialCommands = [];

export const getPublicContext = ({
  setOpen,
  search,
  focusedCommand,
  results,
}: LaunchPadInnerContext): PublicLaunchPadContext => ({
  setOpen,
  search,
  focusedCommand,
  results,
});

export const LaunchPadContextProvider: FC<PropsWithChildren<LaunchPadProps>> = ({
  theme = defaultTheme,
  initiallyOpen = false,

  // optionally controlled
  open: controlledOpen,
  search: controlledSearch,
  onOpenChange, // optional
  onChange,     // search onChange (optional)

  // always-driven-by-parent (read-only here)
  loading = false,
  error = null,
  content = null,
  // always-driven-by-parent (read-only arrays)
  commands = defaultCommands,
  initialCommands = defaultInitialCommands,

  onRenderCommand,
  onRenderCommandContent,
  onSearchSelect,
  searchPlaceholderText = "Search",
  footerContent,
  triggerKey = "k",
  animate = true,
  children,
}) => {
  const [focusedCommand, setFocusedCommand] = useState(0);

  // DOM refs exposed via context
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement | null>(null);
  const [resultsRef, setResultsRef] = useState<HTMLDivElement | null>(null);

  // ---- Controllable open/search ----
  const [open, setOpen] = useControllable<boolean>({
    value: controlledOpen,
    defaultValue: initiallyOpen,
    onChange: onOpenChange,
  });

  const [search, setSearch, isSearchControlled] = useControllable<string>({
    value: controlledSearch,
    defaultValue: "",
    onChange, // parent can mirror it if they want to control
  });


  // ---- Results computed from parent-owned lists + resolved search ----
  const results = useResults({
    commands,
    initialCommands,
    search,
    onChange,
    onSearchSelect,
  });

  // Input change delegates through setSearch (respects controlled/uncontrolled)
  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.currentTarget.value);
    },
    [setSearch]
  );

  // When opening: reset internal state, optionally clear search if *uncontrolled*, focus input
  useEffect(() => {
    if (open) {
      setFocusedCommand(0);
      // Only clear if we own it; don’t clobber a controlled search
      if (!isSearchControlled) {
        setSearch("");
      }
      searchInputRef?.focus();
    }
  }, [open, isSearchControlled, searchInputRef]);

  // When search changes, move focus index and clear *internal* error/flags (if any)
  useEffect(() => {
    setFocusedCommand(0);
  }, [search]);

  // If content becomes non-empty, clear search only when *uncontrolled*
  useEffect(() => {
    if (content && !isSearchControlled) {
      setSearch("");
    }
  }, [content, isSearchControlled, , setSearch]);

  // Keyboard toggle: go through setOpen (respects control)
  useEffect(() => {
    const toggleLaunchPad = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === triggerKey) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", toggleLaunchPad);
    return () => document.removeEventListener("keydown", toggleLaunchPad);
  }, [triggerKey, setOpen]);

  const contextValue: LaunchPadInnerContext = useMemo(
    () => ({
      // internal
      focusedCommand,
      content,

      // resolved / read-only fields
      open,
      search,
      loading,
      error,
      commands,         // from parent
      initialCommands,  // from parent

      // actions / handlers
      setOpen,
      setSearch,
      setFocusedCommand,
      onSearchChange,
      setSearchInputRef,
      setResultsRef,
      resultsRef,

      // computed
      results,

      // other props
      theme,
      triggerKey,
      searchPlaceholderText,
      onSearchSelect,
      onRenderCommand,
      onRenderCommandContent,
      footerContent,
      animate,
    }),
    [
      focusedCommand,
      setFocusedCommand,
      content,
      open,
      setOpen,
      search,
      setSearch,
      loading,
      error,
      commands,
      initialCommands,
      onSearchChange,
      resultsRef,
      results,
      theme,
      triggerKey,
      searchPlaceholderText,
      onSearchSelect,
      onRenderCommand,
      onRenderCommandContent,
      footerContent,
      animate,
    ]
  );

  return (
    <LaunchPadContext.Provider value={contextValue}>
      {children}
    </LaunchPadContext.Provider>
  );
};

export const useLaunchPadContext = () => {
  const context = useContext(LaunchPadContext);
  if (context === null) {
    throw new Error("useLaunchPadContext must be used within a LaunchPadContextProvider");
  }
  return context;
};

