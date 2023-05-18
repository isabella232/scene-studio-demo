import { Environment } from "@vertexvis/viewer";
import { defineCustomElements } from "@vertexvis/viewer/loader";
import React from "react";

import { fetchItemOnTap, Viewer } from "../components/Viewer";
import { config } from "../lib/config";
import { cache } from "../lib/graphql";
import { useSceneStudio } from "../lib/scene-studio";
import { deselectItem, selectItem } from "../lib/undo-commands";
import { translateOnMove } from "../page-content/Translation/TranslateOnMove";
import { ViewerId } from "./scene-viewer";

const DraggablePartsViewer = translateOnMove(fetchItemOnTap(Viewer));

interface ViewerConfig {
  mutationsEnabled: boolean;
  vertexEnv: Environment;
}

export const getServerSideProps = (): Record<string, ViewerConfig> => {
  return {
    props: {
      mutationsEnabled: config.mutationsEnabled,
      vertexEnv: config.vertexEnv,
    },
  };
};

function Translation({
  mutationsEnabled,
  vertexEnv,
}: ViewerConfig): JSX.Element {
  const studioApp = useSceneStudio(cache, mutationsEnabled);
  const { viewerCtx, state, dispatch, undoStack } = studioApp;

  React.useEffect(() => {
    defineCustomElements();
  });

  return (
    <main>
      <div className="w-screen h-screen">
        {vertexEnv && state.clientId && state.streamKey && (
          <DraggablePartsViewer
            viewer={viewerCtx.viewer}
            viewerId={ViewerId}
            sceneViewId={viewerCtx.viewerState.sceneViewId}
            undoStack={undoStack}
            cache={cache}
            configEnv={vertexEnv}
            credentials={{
              clientId: state.clientId,
              streamKey: state.streamKey,
            }}
            selectedItemId={state.selectedItemId}
            onSceneReady={viewerCtx.onSceneReady}
            onSelect={(item) => {
              if (item != null) {
                undoStack.execute(
                  selectItem(viewerCtx.viewer, cache, state, dispatch, item)
                );
              } else {
                const command = deselectItem(
                  viewerCtx.viewer,
                  cache,
                  state,
                  dispatch
                );
                if (command != null) {
                  undoStack.execute(command);
                }
              }
            }}
          />
        )}
      </div>
    </main>
  );
}

export default Translation;
