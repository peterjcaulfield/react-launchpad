import {
  ReactNode,
} from "react";
import { Command } from "../../types";

export type LaunchpadState = {
  open: boolean;
  loading: boolean;
  error: string;
  search: string;
  focusedCommand: number;
  content: ReactNode;
  commands: Command[];
  initialCommands: Command[];
};

export const initialState: LaunchpadState = {
  open: false,
  loading: false,
  error: "",
  search: "",
  focusedCommand: 0,
  content: null,
  commands: [],
  initialCommands: []
};

type Action =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_FOCUSED_COMMAND"; payload: number }
  | { type: "SET_CONTENT"; payload: ReactNode }
  | { type: "TOGGLE_OPEN" }
  | { type: "RESET_STATE" }
  | { type: "ADD_COMMANDS", payload: Command[] }
  | { type: "ADD_INITIAL_COMMANDS", payload: Command[] }
  | { type: "SET_INITIAL_COMMANDS", payload: Command[] | ((current: Command[]) => Command[]) }
  | { type: "SET_COMMANDS", payload: Command[] | ((current: Command[]) => Command[]) };

export const reducer = (state: LaunchpadState, action: Action): LaunchpadState => {
  switch (action.type) {
    case "SET_OPEN":
      return { ...state, open: action.payload };
    case "TOGGLE_OPEN":
      return { ...state, open: !state.open };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_FOCUSED_COMMAND":
      return { ...state, focusedCommand: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "RESET_STATE":
      return { ...state, search: "", error: "", loading: false, focusedCommand: 0 };
    case "ADD_COMMANDS":
      return {
        ...state,
        commands: [
          ...state.commands,
          ...action.payload
        ],
      }
    case "ADD_INITIAL_COMMANDS":
      return {
        ...state,
        initialCommands: [
          ...state.initialCommands,
          ...action.payload
        ],
      }
    case "SET_INITIAL_COMMANDS":
      return {
        ...state,
        initialCommands: typeof action.payload === 'function' ? action.payload(state.initialCommands) : action.payload
      }
    case "SET_COMMANDS":
      return {
        ...state,
        commands: typeof action.payload === 'function' ? action.payload(state.commands) : action.payload
      }
    default:
      return state;
  }
};
