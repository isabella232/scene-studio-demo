import { Environment } from "@vertexvis/viewer";
import type { JSX as ViewerJSX } from "@vertexvis/viewer";
import { VertexSceneTree } from "@vertexvis/viewer-react";
import React from "react";

import { fetchItemOnTap, Viewer } from "../components/Viewer";
import { SceneViewItem } from "../generated/graphql/react";
import { ViewerLayout } from "../layouts/ViewerLayout";
import { config } from "../lib/config";
import { cache } from "../lib/graphql";
import { useSceneStudio } from "../lib/scene-studio";
import { deselectItem, selectItem } from "../lib/undo-commands";
import { ConfirmSaveDialog } from "../page-content/SceneViewer/ConfirmSaveDialog";
import { OpenScene } from "../page-content/SceneViewer/OpenScene";
import { Panel } from "../page-content/SceneViewer/Panel";
import { PrimarySidebar } from "../page-content/SceneViewer/PrimarySidebar";
import { SceneItemSidebar } from "../page-content/SceneViewer/SceneItemSidebar";

export const ViewerId = "vertex-viewer-id";

const MonoscopicViewer = fetchItemOnTap(Viewer);

interface ViewerConfig extends ViewerJSX.VertexSceneTree {
  mutationsEnabled: boolean;
  vertexEnv: Environment;
  sceneTreeHost: string;
  readonly viewer?: HTMLVertexViewerElement;
  readonly sceneTree?: HTMLVertexSceneTreeElement;
}

export const getServerSideProps = (): Record<string, ViewerConfig> => {
  return {
    props: {
      mutationsEnabled: config.mutationsEnabled,
      vertexEnv: config.vertexEnv,
      sceneTreeHost: config.sceneTreeHost,
    },
  };
};

export default function SceneViewer({
  mutationsEnabled,
  vertexEnv,
}: ViewerConfig): JSX.Element {
  const ref = React.useRef<HTMLVertexSceneTreeElement>(null);
  const studioApp = useSceneStudio(cache, mutationsEnabled);
  const { viewerCtx, state, dispatch, undoStack } = studioApp;

  const handleSelectItem = async (
    item?: Pick<SceneViewItem, "id">
  ): Promise<void> => {
    if (item != null) {
      undoStack.execute(
        selectItem(viewerCtx.viewer, cache, state, dispatch, item)
      );

      if (ref.current != null) {
        ref.current.scrollToItem(item.id);
      }
    } else {
      const command = deselectItem(viewerCtx.viewer, cache, state, dispatch);
      if (command != null) {
        undoStack.execute(command);
      } else {
        const scene = await viewerCtx.viewer.current?.scene();
        if (scene) {
          return scene
            .items((ops) => ops.where((q) => q.all()).deselect())
            .execute();
        }
      }
    }
  };

  return (
    <>
      <ViewerLayout
        mutationsEnabled={mutationsEnabled}
        studioApp={studioApp}
        sidebar={
          <PrimarySidebar
            activePanel={state.activePrimaryPanel}
            onPanelSelected={(panel) =>
              dispatch({ type: "set-active-primary-panel", panel })
            }
          />
        }
      >
        {state.activePrimaryPanel === "scene-objects" && (
          <Panel overlay={true}>
            <div className="flex items-center h-full w-full text-md text-neutral-600 border-b">
              <VertexSceneTree
                configEnv={vertexEnv}
                ref={ref}
                viewerSelector={`#${ViewerId}`}
              />
            </div>
          </Panel>
        )}
        {viewerCtx.viewerState.isReady &&
          vertexEnv != null &&
          state.clientId != null &&
          state.streamKey != null && (
            <div className="w-0 flex-grow ml-auto relative">
              <MonoscopicViewer
                configEnv={vertexEnv}
                credentials={{
                  clientId: state.clientId,
                  streamKey: state.streamKey,
                }}
                viewer={viewerCtx.viewer}
                viewerId={ViewerId}
                onConnectionChange={viewerCtx.onConnectionChange}
                onSceneReady={viewerCtx.onSceneReady}
                onSelect={handleSelectItem}
              />
              <div className="absolute bottom-4 w-full flex justify-center">
                <button
                  className="px-3 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                  disabled={!undoStack.canUndo}
                  onClick={() => undoStack.undo()}
                >
                  Undo
                </button>
                <button
                  className="px-3 py-2 bg-gray-200 rounded-md ml-2 disabled:opacity-50"
                  disabled={!undoStack.canRedo}
                  onClick={() => undoStack.redo()}
                >
                  Redo
                </button>
              </div>
            </div>
          )}
        <SceneItemSidebar
          viewerCtx={viewerCtx}
          cache={cache}
          undoStack={undoStack}
          selectedItemId={state.selectedItemId}
        />
      </ViewerLayout>
      {state.isOpenModelDialogOpen && (
        <OpenScene
          credentials={{
            clientId: state.clientId ?? "",
            streamKey: state.streamKey ?? "",
          }}
          open={state.isOpenModelDialogOpen}
          onClose={() =>
            dispatch({ type: "set-open-model-dialog", isOpen: true })
          }
          onConfirm={(creds) => {
            dispatch({
              type: "open-model",
              clientId: creds?.clientId,
              streamKey: creds?.streamKey,
            });
            dispatch({ type: "set-open-model-dialog", isOpen: false });
          }}
        />
      )}
      {state.isConfirmSaveDialogOpen && (
        <ConfirmSaveDialog
          studioApp={studioApp}
          open={state.isConfirmSaveDialogOpen}
          onClose={() =>
            dispatch({ type: "set-confirm-save-dialog", isOpen: false })
          }
        />
      )}
    </>
  );
}
