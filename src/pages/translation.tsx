import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import { defineCustomElements } from "@vertexvis/viewer-react";
import React from "react";

import { fetchItemOnTap, Viewer } from "../components/Viewer";
import { SiteLayout } from "../layouts/SiteLayout";
import { config } from "../lib/config";
import { cache } from "../lib/graphql";
import { useSceneStudio } from "../lib/scene-studio";
import { deselectItem, selectItem } from "../lib/undo-commands";
import { translateOnMove } from "../page-content/Translation/TranslateOnMove";

const DraggablePartsViewer = translateOnMove(fetchItemOnTap(Viewer));

interface ViewerConfig {
  vertexEnv: Environment;
}

export const getServerSideProps = (): Record<string, ViewerConfig> => {
  return { props: { vertexEnv: config.vertexEnv } };
};

function Translation({ vertexEnv }: ViewerConfig): JSX.Element {
  const studioApp = useSceneStudio(cache);
  const { viewerCtx, state, dispatch, undoStack } = studioApp;

  React.useEffect(() => {
    defineCustomElements();
  });

  return (
    <SiteLayout>
      <div className="w-screen h-screen">
        {vertexEnv && state.clientId && state.streamKey && (
          <DraggablePartsViewer
            viewer={viewerCtx.viewer}
            sceneViewId={viewerCtx.viewerState.sceneViewId}
            undoStack={undoStack}
            cache={cache}
            configEnv={vertexEnv}
            clientId={state.clientId}
            streamKey={state.streamKey}
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
    </SiteLayout>
  );
}

export default Translation;
