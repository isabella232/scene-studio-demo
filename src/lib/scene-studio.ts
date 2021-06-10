import { InMemoryCache } from "@apollo/client";
import { Camera } from "@vertexvis/viewer/dist/types/scenes";
import { useRouter } from "next/router";
import {
  Dispatch as ReactDispatch,
  Reducer,
  useEffect,
  useReducer,
} from "react";

import { useSaveSceneViewMutation } from "../generated/graphql/react";
import { UndoManager, useUndoRedo } from "./undo";
import { useViewer, ViewerContext } from "./viewer";

export type PrimaryPanel = "scene-objects" | "parts";

export interface State {
  selectedItemId?: string;
  isOpenModelDialogOpen: boolean;
  isConfirmSaveDialogOpen: boolean;
  activePrimaryPanel?: PrimaryPanel;
  clientId?: string;
  streamKey?: string;
  isSaving: boolean;
}

export type Dispatch = ReactDispatch<Action>;

export interface SceneStudio {
  state: State;
  dispatch: Dispatch;
  viewerCtx: ViewerContext;
  undoStack: UndoManager;

  save(camera?: Camera): Promise<void>;
}

export type Action =
  | { type: "select-item"; selectedItemId?: string }
  | { type: "set-open-model-dialog"; isOpen: boolean }
  | { type: "set-confirm-save-dialog"; isOpen: boolean }
  | { type: "open-model"; clientId: string; streamKey: string }
  | { type: "set-active-primary-panel"; panel?: PrimaryPanel }
  | { type: "set-is-saving"; isSaving: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select-item":
      return { ...state, selectedItemId: action.selectedItemId };
    case "set-open-model-dialog":
      return { ...state, isOpenModelDialogOpen: action.isOpen };
    case "set-confirm-save-dialog":
      return { ...state, isConfirmSaveDialogOpen: action.isOpen };
    case "open-model":
      return {
        ...state,
        clientId: action.clientId,
        streamKey: action.streamKey,
      };
    case "set-active-primary-panel":
      return { ...state, activePrimaryPanel: action.panel };
    case "set-is-saving":
      return { ...state, isSaving: action.isSaving };
  }
}

export function useSceneStudio(
  cache: InMemoryCache,
  mutationsEnabled: boolean
): SceneStudio {
  const { query } = useRouter();
  const viewerCtx = useViewer();
  const undoStack = useUndoRedo();
  const [save, { loading: isSaving }] = useSaveSceneViewMutation();

  const clientId = query.clientId?.toString();
  const streamKey = query.streamKey?.toString();

  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    isOpenModelDialogOpen: clientId == null || streamKey == null,
    isConfirmSaveDialogOpen: false,
    clientId,
    streamKey,
    isSaving: false,
  });

  useEffect(() => dispatch({ type: "set-is-saving", isSaving }), [isSaving]);

  return {
    state,
    dispatch,
    viewerCtx,
    undoStack,

    async save(camera?: Camera): Promise<void> {
      if (viewerCtx.viewerState.sceneViewId != null) {
        undoStack.clear();
        const cameraUpdate =
          camera != null
            ? {
                lookAt: camera.lookAt,
                up: camera.up,
                position: camera.position,
              }
            : undefined;
        await save({
          variables: {
            enabled: mutationsEnabled,
            sceneViewId: viewerCtx.viewerState.sceneViewId,
            camera: cameraUpdate,
          },
        });
        await cache.reset();
      }
    },
  };
}
