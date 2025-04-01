import { describe, it, expect } from 'vitest';
import { reducer, LaunchpadState } from '.';

const defaultCmd = { text: 'Default Command', onSelect: () => { } };

describe('LaunchPad reducer', () => {
  const initialState: LaunchpadState = {
    open: false,
    loading: false,
    error: "",
    search: "",
    focusedCommand: 0,
    content: null,
    commands: [defaultCmd],
    initialCommands: []
  };

  it('should handle SET_OPEN', () => {
    const newState = reducer(initialState, { type: "SET_OPEN", payload: true });
    expect(newState.open).toBe(true);
  });

  it('should handle SET_LOADING', () => {
    const newState = reducer(initialState, { type: "SET_LOADING", payload: true });
    expect(newState.loading).toBe(true);
  });

  it('should handle SET_ERROR', () => {
    const newState = reducer(initialState, { type: "SET_ERROR", payload: "Error occurred" });
    expect(newState.error).toBe("Error occurred");
  });

  it('should handle SET_SEARCH', () => {
    const newState = reducer(initialState, { type: "SET_SEARCH", payload: "query" });
    expect(newState.search).toBe("query");
  });

  it('should handle SET_FOCUSED_COMMAND', () => {
    const newState = reducer(initialState, { type: "SET_FOCUSED_COMMAND", payload: 2 });
    expect(newState.focusedCommand).toBe(2);
  });

  it('should handle SET_CONTENT', () => {
    const newState = reducer(initialState, { type: "SET_CONTENT", payload: "Test Content" });
    expect(newState.content).toBe("Test Content");
  });

  it('should handle ADD_COMMANDS', () => {
    const cmd = { text: 'My Command', onSelect: () => { } };
    const newState = reducer(initialState, { type: "ADD_COMMANDS", payload: [cmd] });
    expect(newState.commands).toEqual([defaultCmd, cmd]);
  });

  it('should handle RESET_STATE while preserving non-reset fields', () => {
    const modifiedState: LaunchpadState = {
      open: true, // open remains unchanged
      loading: true,
      error: "Some error",
      search: "hello",
      focusedCommand: 3,
      content: "Preserved Content", // content remains unchanged
      commands: [],
      initialCommands: []
    };
    const newState = reducer(modifiedState, { type: "RESET_STATE" });
    expect(newState.search).toBe("");
    expect(newState.error).toBe("");
    expect(newState.loading).toBe(false);
    expect(newState.focusedCommand).toBe(0);
    // Verify that fields not meant to be reset remain unchanged
    expect(newState.open).toBe(true);
    expect(newState.content).toBe("Preserved Content");
  });
});
