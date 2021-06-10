import { InMemoryCache } from "@apollo/client";
import isEqual from "lodash.isequal";
import React, { useEffect, useState } from "react";

import { Collapsible } from "../../components/Collapsible";
import { NumericInput } from "../../components/NumericInput";
import {
  SceneViewItemQuery,
  Transform,
  useSceneViewItemQuery,
} from "../../generated/graphql/react";
import { UndoManager } from "../../lib/undo";
import { transform } from "../../lib/undo-commands";
import { ViewerContext } from "../../lib/viewer";
import { Panel } from "./Panel";
import { PropertiesSection } from "./PropertiesSection";

interface Props {
  viewerCtx: ViewerContext;
  cache: InMemoryCache;
  undoStack: UndoManager;
  selectedItemId?: string;
}

export function SceneItemSidebar({
  viewerCtx: { viewer, viewerState },
  undoStack,
  cache,
  selectedItemId,
}: Props): JSX.Element {
  const { data } = useSceneViewItemQuery({
    variables: {
      sceneViewId: viewerState.sceneViewId || "",
      itemId: selectedItemId || "",
    },
    fetchPolicy: "cache-only",
    skip: viewerState.sceneViewId == null || selectedItemId == null,
  });
  const editableTransform = useEditTransform(viewer, undoStack, cache, data);

  return (
    <Panel position="right">
      <PropertiesSection sceneViewItem={data?.sceneViewItem} />
      <div className="w-full px-2 border-b">
        <Collapsible title="TRANSFORMS">
          <div className="grid grid-cols-3 grid-rows-6 gap-x-2 mb-4 text-sm text-neutral-700">
            <div className="flex items-center col-span-full">Position (mm)</div>
            <NumericInput
              label="X"
              value={editableTransform?.committedTransform.position.x || 0}
              disabled={editableTransform == null}
              onBlur={numericInputHandler(editableTransform, (x, t) => ({
                ...t,
                position: { ...t.position, x },
              }))}
            />
            <NumericInput
              label="Y"
              value={editableTransform?.committedTransform.position.y || 0}
              disabled={editableTransform == null}
              onBlur={numericInputHandler(editableTransform, (y, t) => ({
                ...t,
                position: { ...t.position, y },
              }))}
            />
            <NumericInput
              label="Z"
              value={editableTransform?.committedTransform.position.z || 0}
              disabled={editableTransform == null}
              onBlur={numericInputHandler(editableTransform, (z, t) => ({
                ...t,
                position: { ...t.position, z },
              }))}
            />
            <div className="flex items-center col-span-full">Rotation</div>
            <NumericInput
              label="X"
              value={editableTransform?.committedTransform.rotation.x || 0}
              disabled={editableTransform == null}
              onBlur={numericInputHandler(editableTransform, (x, t) => ({
                ...t,
                rotation: { ...t.rotation, x },
              }))}
            />
            <NumericInput
              label="Y"
              value={editableTransform?.committedTransform.rotation.y || 0}
              disabled={editableTransform == null}
              onBlur={numericInputHandler(editableTransform, (y, t) => ({
                ...t,
                rotation: { ...t.rotation, y },
              }))}
            />
            <NumericInput
              label="Z"
              value={editableTransform?.committedTransform.rotation.z || 0}
              disabled={editableTransform == null}
              onBlur={numericInputHandler(editableTransform, (z, t) => ({
                ...t,
                rotation: { ...t.rotation, z },
              }))}
            />
            <div className="flex items-center col-span-full">Scale</div>
            <NumericInput
              value={editableTransform?.committedTransform.scale || 1}
              min="0.01"
              step="0.01"
              disabled={editableTransform == null}
              onBlur={numericInputHandler(editableTransform, (scale, t) => ({
                ...t,
                scale,
              }))}
            />
          </div>
        </Collapsible>
      </div>
    </Panel>
  );
}

interface EditTransform {
  committedTransform: Transform;
  transformToCommit?: Transform;

  commit(transform: Transform): void;
}

function useEditTransform(
  viewer: React.MutableRefObject<HTMLVertexViewerElement | null>,
  undoStack: UndoManager,
  cache: InMemoryCache,
  query?: SceneViewItemQuery
): EditTransform | undefined {
  const committedTransform = query?.sceneViewItem?.transform;
  const [transformToCommit, setTransformToCommit] = useState<Transform>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query?.sceneViewItem != null && transformToCommit != null) {
        undoStack.execute(
          transform(viewer, cache, query?.sceneViewItem, transformToCommit)
        );
      }
    }, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformToCommit]);

  if (committedTransform) {
    return {
      committedTransform,
      transformToCommit,
      commit(t: Transform) {
        if (!isEqual(committedTransform, t)) {
          setTransformToCommit(t);
        }
      },
    };
  } else {
    return undefined;
  }
}

function numericInputHandler(
  editableTransform: EditTransform | undefined,
  f: (value: number, transform: Transform) => Transform
): (value: React.FormEvent<HTMLInputElement>) => void {
  return (event) => {
    const num = event.currentTarget.valueAsNumber || 0;
    if (editableTransform != null) {
      const t = f(num, editableTransform.committedTransform);
      editableTransform.commit(t);
    }
  };
}
