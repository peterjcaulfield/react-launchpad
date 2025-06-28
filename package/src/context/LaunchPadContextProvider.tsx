"use client";

import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
  useState,
  ReactNode,
} from "react";

import { theme as defaultTheme } from "../theme/slack";
import {
  LaunchPadProps,
  LaunchPadInnerContext,
  LaunchPadContext as PublicLaunchPadContext,
  Command,
} from "../types";
import { useResults } from "./hooks";

import { reducer, initialState } from './state';

const LaunchPadContext = createContext<LaunchPadInnerContext | null>(null);

export const getPublicContext = ({
  setOpen,
  setError,
  setLoading,
  search,
  focusedCommand,
  results,
  setContent,
}: LaunchPadInnerContext): PublicLaunchPadContext => ({
  setOpen,
  setError,
  setLoading,
  search,
  focusedCommand,
  results,
  setContent,
});

export const LaunchPadContextProvider: FC<PropsWithChildren<LaunchPadProps>> = ({
  theme = defaultTheme,
  initiallyOpen = false,
  open: controlledOpen,
  commands = [],
  initialCommands = [],
  search: controlledSearch,
  onChange,
  onRenderCommand,
  onRenderCommandContent,
  onSearchSelect,
  searchPlaceholderText = "Search",
  error: controlledError,
  loading: controlledLoading,
  footerContent,
  triggerKey = "k",
  animate = true,
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    commands,
    initialCommands,
    open: controlledOpen !== undefined ? controlledOpen : initiallyOpen,
    loading: controlledLoading !== undefined ? controlledLoading : false,
    error: controlledError !== undefined ? controlledError : "",
    search: controlledSearch !== undefined ? controlledSearch : "",
  });
  // Use state for DOM elements so we have setter functions for context
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement | null>(null);
  const [resultsRef, setResultsRef] = useState<HTMLDivElement | null>(null);

  // Controlled prop sync
  useEffect(() => {
    if (controlledOpen !== undefined) {
      dispatch({ type: "SET_OPEN", payload: controlledOpen });
    }
  }, [controlledOpen]);

  useEffect(() => {
    if (controlledLoading !== undefined) {
      dispatch({ type: "SET_LOADING", payload: controlledLoading });
    }
  }, [controlledLoading]);

  useEffect(() => {
    if (controlledError !== undefined) {
      dispatch({ type: "SET_ERROR", payload: controlledError });
    }
  }, [controlledError]);

  useEffect(() => {
    if (controlledSearch !== undefined) {
      dispatch({ type: "SET_SEARCH", payload: controlledSearch });
    }
  }, [controlledSearch]);

  const results = useResults({
    commands: state.commands,
    initialCommands: state.initialCommands,
    search: state.search,
    onChange,
    onSearchSelect,
  });

  // Handle search input changes
  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_SEARCH", payload: e.currentTarget.value });
      if (onChange) {
        onChange(e.currentTarget.value);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (state.open) {
      dispatch({ type: "RESET_STATE" });
      if (searchInputRef) {
        searchInputRef.focus();
      }
    }
  }, [state.open, searchInputRef]);

  useEffect(() => {
    dispatch({ type: "SET_FOCUSED_COMMAND", payload: 0 });
    dispatch({ type: "SET_ERROR", payload: "" });
  }, [state.search]);

  useEffect(() => {
    if (state.content) {
      dispatch({ type: "SET_SEARCH", payload: "" });
    }
  }, [state.content]);

  useEffect(() => {
    const toggleLaunchPad = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === triggerKey) {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "TOGGLE_OPEN" });
      }
    };

    document.addEventListener("keydown", toggleLaunchPad);
    return () => document.removeEventListener("keydown", toggleLaunchPad);
  }, [triggerKey]);

  const actions = useMemo(() => ({
    setOpen: (open: boolean) => dispatch({ type: "SET_OPEN", payload: open }),
    setLoading: (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading }),
    setError: (error: string) => dispatch({ type: "SET_ERROR", payload: error }),
    setSearch: (search: string) => dispatch({ type: "SET_SEARCH", payload: search }),
    setFocusedCommand: (index: number) => dispatch({ type: "SET_FOCUSED_COMMAND", payload: index }),
    setContent: (content: ReactNode) => dispatch({ type: "SET_CONTENT", payload: content }),
    addCommands: (commands: Command[]) => dispatch({ type: "ADD_COMMANDS", payload: commands }),
    setCommands: (payload: ((commands: Command[]) => Command[]) | Command[]) => dispatch({ type: 'SET_COMMANDS', payload }),
    addInitialCommands: (commands: Command[]) => dispatch({ type: "ADD_INITIAL_COMMANDS", payload: commands }),
    setInitialCommands: (payload: ((commands: Command[]) => Command[]) | Command[]) => dispatch({ type: 'SET_INITIAL_COMMANDS', payload }),
  }), [])


  const contextValue: LaunchPadInnerContext = useMemo(
    () => ({
      ...state,
      ...actions,
      onSearchChange,
      setSearchInputRef,
      setResultsRef,
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
    }),
    [
      state,
      onSearchChange,
      setSearchInputRef,
      setResultsRef,
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

