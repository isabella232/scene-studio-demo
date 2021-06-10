import { ConnectionStatus } from "@vertexvis/viewer/dist/types/components/viewer/viewer";
import { defineCustomElements } from "@vertexvis/viewer-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

export interface ViewerContext {
  viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
  onConnectionChange: (event: CustomEvent<ConnectionStatus>) => void;
  onSceneReady: () => void;
  viewerState: ViewerState;
}

interface ViewerState {
  jwt?: string;
  sceneViewId?: string;
  isReady: boolean;
}

export function useViewer(): ViewerContext {
  const ref = useRef<HTMLVertexViewerElement>(null);
  const [state, setState] = useState<ViewerState>({ isReady: false });

  const onSceneReady = useCallback(async () => {
    const scene = await ref.current?.scene();
    const sceneViewId = scene?.sceneViewId;
    setState({ ...state, sceneViewId: sceneViewId });
  }, [state]);

  const onConnectionChange = useCallback(
    (event: CustomEvent<ConnectionStatus>) => {
      if (event.detail.status === "connected") {
        setState({ ...state, jwt: event.detail.jwt });
      }
    },
    [state]
  );

  useEffect(() => {
    async function setup(): Promise<void> {
      await defineCustomElements();
      setState({ ...state, isReady: true });
    }

    if (!state.isReady) setup();
    return undefined;
  }, [state]);

  return { viewer: ref, viewerState: state, onConnectionChange, onSceneReady };
}
