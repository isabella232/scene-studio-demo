import { useState } from "react";

export interface UndoCommand {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

interface UndoState {
  previous: UndoCommand[];
  next: UndoCommand[];
  canUndo: boolean;
  canRedo: boolean;
}

interface UndoOperations {
  execute(command: UndoCommand): Promise<void>;
  undo(): Promise<void>;
  redo(): Promise<void>;
  clear(): void;
}

interface UndoOptions {
  max?: number;
}

export type UndoManager = UndoState & UndoOperations;

const identity: UndoState = {
  previous: [],
  next: [],
  canUndo: false,
  canRedo: false,
};

export function useUndoRedo({ max = 500 }: UndoOptions = {}): UndoManager {
  const maxCommands = Math.max(max, 1);
  const [state, setState] = useState(identity);

  function execute(command: UndoCommand): Promise<void> {
    const previous =
      maxCommands > 1
        ? [...state.previous.slice(-(maxCommands - 1)), command]
        : [command];
    const next = [] as UndoCommand[];
    setState({
      previous,
      next,
      canUndo: previous.length > 0,
      canRedo: next.length > 0,
    });
    return command.execute();
  }

  function undo(): Promise<void> {
    if (state.previous.length > 0) {
      const command = state.previous[state.previous.length - 1];
      const previous = state.previous.slice(0, state.previous.length - 1);
      const next = [command, ...state.next];
      setState({
        previous,
        next,
        canUndo: previous.length > 0,
        canRedo: next.length > 0,
      });
      return command.undo();
    } else {
      throw new Error("Cannot perform undo. No commands to undo.");
    }
  }

  function redo(): Promise<void> {
    if (state.next.length > 0) {
      const command = state.next[0];
      const previous = [...state.previous, command];
      const next = state.next.slice(1);
      setState({
        previous,
        next,
        canUndo: previous.length > 0,
        canRedo: next.length > 0,
      });
      return command.execute();
    } else {
      throw new Error("Cannot perform redo. No commands to redo.");
    }
  }

  function clear(): void {
    setState(identity);
  }

  return { ...state, execute, undo, redo, clear };
}
