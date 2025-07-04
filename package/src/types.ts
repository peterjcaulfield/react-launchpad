import { Dispatch, SetStateAction } from "react";

export interface Theme {
  icon?: string;
  modal: {
    root: string;
  };
  results?: {
    root: string;
  };
  loading?: {
    root: string;
  }
  search?: {
    root: string;
    input?: {
      root: string;
    };
  };
  command?: {
    root: string;
    active: string;
    wrapper?: string;
  };
  footer?: {
    root: string;
  };
  error?: {
    root: string;
  };
}


interface BaseCommand {
  icon?: JSX.Element;
  text: string;
  preview?: React.FC;
  extra?: Record<string, unknown>;
}

export enum CommandType {
  Default = "default",
  Search = "search",
}

export interface SearchCommand extends BaseCommand {
  type: CommandType.Search;
}

export interface DefaultCommand extends BaseCommand {
  onSelect: onSelectCallback;
}

export type Command = DefaultCommand | SearchCommand;

interface OnSelectCallbackContext extends LaunchPadContext {
  event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent;

}

export type onSelectCallback = (context: OnSelectCallbackContext) => void | Promise<void>;

export interface LaunchPadProps {
  initiallyOpen?: boolean;
  open?: boolean;
  initialCommands?: Command[];
  commands?: Command[];
  searchPlaceholderText?: string;
  onSearchSelect?: onSelectCallback;
  search?: string;
  onChange?: (val: string) => void;
  loading?: boolean;
  error?: string;
  onRenderCommand?: (command: Command) => JSX.Element | null;
  onRenderCommandContent?: (defaultContent: React.ReactNode, commands: Command[], index: number) => React.ReactNode | null;
  theme?: Theme;
  triggerKey?: string;
  footerContent?: string;
  animate?: boolean;
}

export interface LaunchPadInnerContext {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  focusedCommand: number;
  setFocusedCommand: Dispatch<SetStateAction<number>>;
  results: Command[];
  resultsRef: HTMLDivElement | null;
  onRenderCommand: LaunchPadProps['onRenderCommand']
  onRenderCommandContent: LaunchPadProps['onRenderCommandContent']
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSearchInputRef: Dispatch<SetStateAction<HTMLInputElement | null>>;
  searchPlaceholderText: string;
  onSearchSelect?: (context: LaunchPadContext) => void | Promise<void>;
  setResultsRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  addCommands: (command: Command[]) => void;
  addInitialCommands: (command: Command[]) => void;
  setCommands: (payload: ((command: Command[]) => Command[]) | Command[]) => void;
  setInitialCommands: (payload: ((command: Command[]) => Command[]) | Command[]) => void;
  error?: string;
  setError: Dispatch<SetStateAction<string>>;
  theme: Theme;
  triggerKey?: string;
  footerContent?: string;
  content: React.ReactNode;
  setContent: Dispatch<SetStateAction<React.ReactNode>>;
  animate: boolean;
}

export type LaunchPadContext = Pick<
  LaunchPadInnerContext,
  "setOpen" | "setLoading" | "setError" | "search" | "focusedCommand" | "results" | "setContent"
>;
