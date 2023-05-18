import { gql, InMemoryCache } from "@apollo/client";
import { Color } from "@vertexvis/utils";
import { ColorMaterial } from "@vertexvis/viewer";
import { SceneItemOperationsBuilder } from "@vertexvis/viewer/dist/types/lib/scenes";
import React, { Dispatch as ReactDispatch } from "react";

import { SceneViewItem, Transform } from "../generated/graphql/react";
import { toMatrix } from "./math3d";
import { Action, Dispatch, State } from "./scene-studio";
import { UndoCommand } from "./undo";

type ViewerRef = React.MutableRefObject<HTMLVertexViewerElement | null>;

const materialOverrideFragment = gql`
  fragment MaterialOverrideSceneViewItem on SceneViewItem {
    materialOverride {
      opacity
      glossiness
      ambient
      diffuse
      emissive
      specular
    }
  }
`;

const transformFragment = gql`
  fragment TransformSceneViewItem on SceneViewItem {
    transform {
      position {
        x
        y
        z
      }
      rotation {
        x
        y
        z
      }
      scale
    }
  }
`;

const itemFragment = gql`
  fragment FullSceneViewItem on SceneViewItem {
    id
    visible
    ...MaterialOverrideSceneViewItem
    ...TransformSceneViewItem
  }
  ${materialOverrideFragment}
  ${transformFragment}
`;

export function hide(
  viewer: ViewerRef,
  cache: InMemoryCache,
  item: Pick<SceneViewItem, "__typename" | "id">
): UndoCommand {
  return itemCommand(
    viewer,
    item.id,
    (op) => {
      cache.writeFragment({
        id: cache.identify(item),
        fragment: gql`
          fragment HideSceneViewItem on SceneViewItem {
            visible
          }
        `,
        data: { visible: false },
      });
      return op.hide();
    },
    (op) => {
      cache.writeFragment({
        id: cache.identify(item),
        fragment: gql`
          fragment HideSceneViewItem on SceneViewItem {
            visible
          }
        `,
        data: { visible: true },
      });
      return op.show();
    }
  );
}

export function show(viewer: ViewerRef, itemId: string): UndoCommand {
  return itemCommand(
    viewer,
    itemId,
    (op) => op.show(),
    (op) => op.hide()
  );
}

export function overrideMaterial(
  viewer: ViewerRef,
  cache: InMemoryCache,
  item: Pick<SceneViewItem, "id" | "materialOverride">,
  material: ColorMaterial.ColorMaterial
): UndoCommand {
  return itemCommand(
    viewer,
    item.id,
    (op) => {
      cache.writeFragment({
        id: cache.identify(item),
        fragment: materialOverrideFragment,
        data: {
          materialOverride: {
            opacity: material.opacity,
            glossiness: material.glossiness,
            ambient: Color.toHexString(material.ambient),
            diffuse: Color.toHexString(material.diffuse),
            emissive: Color.toHexString(material.emissive),
            specular: Color.toHexString(material.specular),
          },
        },
      });
      return op.materialOverride(material);
    },
    (op) => {
      if (item.materialOverride != null) {
        const ambient = Color.fromHexString(item.materialOverride.ambient);
        const diffuse = Color.fromHexString(item.materialOverride.diffuse);
        const emissive = Color.fromHexString(item.materialOverride.emissive);
        const specular = Color.fromHexString(item.materialOverride.specular);

        if (ambient && diffuse && emissive && specular) {
          cache.writeFragment({
            id: cache.identify(item),
            fragment: materialOverrideFragment,
            data: {
              materialOverride: {
                opacity: item.materialOverride.opacity,
                glossiness: item.materialOverride.glossiness,
                ambient: Color.toHexString(ambient),
                diffuse: Color.toHexString(diffuse),
                emissive: Color.toHexString(emissive),
                specular: Color.toHexString(specular),
              },
            },
          });

          return op.materialOverride({
            opacity: item.materialOverride.opacity,
            glossiness: item.materialOverride.glossiness,
            ambient,
            diffuse,
            emissive,
            specular,
          });
        } else {
          throw new Error(
            "Cannot apply redo. Material override has invalid color values."
          );
        }
      } else {
        cache.writeFragment({
          id: cache.identify(item),
          fragment: materialOverrideFragment,
          data: {
            materialOverride: null,
          },
        });
        return op.clearMaterialOverrides();
      }
    }
  );
}

export function clearMaterial(
  viewer: ViewerRef,
  cache: InMemoryCache,
  item: Pick<SceneViewItem, "id" | "materialOverride">
): UndoCommand {
  const material = item.materialOverride;
  return itemCommand(
    viewer,
    item.id,
    (op) => {
      cache.writeFragment({
        id: cache.identify(item),
        fragment: materialOverrideFragment,
        data: { materialOverride: null },
      });
      return op.clearMaterialOverrides();
    },
    (op) => {
      if (material != null) {
        const ambient = Color.fromHexString(material.ambient);
        const diffuse = Color.fromHexString(material.diffuse);
        const emissive = Color.fromHexString(material.emissive);
        const specular = Color.fromHexString(material.specular);

        if (ambient && diffuse && emissive && specular) {
          cache.writeFragment({
            id: cache.identify(item),
            fragment: materialOverrideFragment,
            data: {
              materialOverride: {
                opacity: material.opacity,
                glossiness: material.glossiness,
                ambient: Color.toHexString(ambient),
                diffuse: Color.toHexString(diffuse),
                emissive: Color.toHexString(emissive),
                specular: Color.toHexString(specular),
              },
            },
          });
          return op.materialOverride({
            opacity: material.opacity,
            glossiness: material.glossiness,
            ambient,
            diffuse,
            emissive,
            specular,
          });
        } else {
          throw new Error(
            "Cannot apply undo. Material override has invalid color values."
          );
        }
      } else {
        cache.writeFragment({
          id: cache.identify(item),
          fragment: materialOverrideFragment,
          data: { materialOverride: null },
        });
        return op.clearMaterialOverrides();
      }
    }
  );
}

export function transform(
  viewer: ViewerRef,
  cache: InMemoryCache,
  item: Pick<SceneViewItem, "id" | "transform">,
  transform: Transform
): UndoCommand {
  return itemCommand(
    viewer,
    item.id,
    (op) => {
      cache.writeFragment({
        id: cache.identify(item),
        fragment: transformFragment,
        data: { transform },
      });
      const matrix = toMatrix(transform);
      return op.transform(matrix);
    },
    (op) => {
      cache.writeFragment({
        id: cache.identify(item),
        fragment: transformFragment,
        data: { transform: item.transform },
      });
      const matrix = toMatrix(item.transform);
      return op.transform(matrix);
    }
  );
}

export function selectItem(
  viewer: ViewerRef,
  cache: InMemoryCache,
  state: State,
  dispatch: Dispatch,
  item: Pick<SceneViewItem, "id">
): UndoCommand {
  if (state.selectedItemId != null) {
    const selectedItem = cache.readFragment<SceneViewItem>({
      id: `SceneViewItem:${state.selectedItemId}`,
      fragment: itemFragment,
      fragmentName: "FullSceneViewItem",
    });

    if (selectedItem == null) {
      throw new Error("Item fragment is null or contains missing fields");
    }

    return composite(
      reducer<Action, Dispatch>(
        dispatch,
        { type: "select-item", selectedItemId: item.id },
        { type: "select-item", selectedItemId: state.selectedItemId }
      ),
      deselect(viewer, state.selectedItemId),
      select(viewer, cache, item)
    );
  } else {
    return composite(
      reducer<Action, Dispatch>(
        dispatch,
        { type: "select-item", selectedItemId: item.id },
        { type: "select-item", selectedItemId: undefined }
      ),
      select(viewer, cache, item)
    );
  }
}

export function deselectItem(
  viewer: ViewerRef,
  cache: InMemoryCache,
  state: State,
  dispatch: Dispatch
): UndoCommand | undefined {
  if (state.selectedItemId != null) {
    const item = cache.readFragment<SceneViewItem>({
      id: `SceneViewItem:${state.selectedItemId}`,
      fragment: itemFragment,
      fragmentName: "FullSceneViewItem",
    });

    if (item == null) {
      throw new Error("Item fragment is null or contains missing fields");
    }

    return composite(
      reducer<Action, Dispatch>(
        dispatch,
        { type: "select-item", selectedItemId: undefined },
        { type: "select-item", selectedItemId: state.selectedItemId }
      ),
      deselect(viewer, item.id)
    );
  } else {
    return undefined;
  }
}

export function select(
  viewer: ViewerRef,
  cache: InMemoryCache,
  item: Pick<SceneViewItem, "id">
): UndoCommand {
  return itemCommand(
    viewer,
    item.id,
    (op) => {
      cache.writeFragment({
        id: cache.identify(item),
        fragment: gql`
          fragment SelectSceneViewItem on SceneViewItem {
            selected
          }
        `,
        data: { selected: true },
      });
      return op.select();
    },
    (op) => {
      cache.writeFragment({
        id: cache.identify(item),
        fragment: gql`
          fragment SelectSceneViewItem on SceneViewItem {
            selected
          }
        `,
        data: { selected: false },
      });
      return op.deselect();
    }
  );
}

export function deselect(viewer: ViewerRef, itemId: string): UndoCommand {
  return itemCommand(
    viewer,
    itemId,
    (op) => op.deselect(),
    (op) => op.select()
  );
}

export function composite(...commands: UndoCommand[]): UndoCommand {
  return {
    execute(): Promise<void> {
      return Promise.resolve(commands.forEach((c) => c.execute()));
    },
    undo(): Promise<void> {
      return Promise.resolve(commands.forEach((c) => c.undo()));
    },
  };
}

export function reducer<A, D extends ReactDispatch<A>>(
  dispatch: D,
  redo: A,
  undo: A
): UndoCommand {
  return {
    execute() {
      return Promise.resolve(dispatch(redo));
    },
    undo() {
      return Promise.resolve(dispatch(undo));
    },
  };
}

function itemCommand(
  viewer: ViewerRef,
  itemId: string,
  redo: (builder: SceneItemOperationsBuilder) => SceneItemOperationsBuilder,
  undo: (builder: SceneItemOperationsBuilder) => SceneItemOperationsBuilder
): UndoCommand {
  return {
    async execute(): Promise<void> {
      const scene = await viewer.current?.scene();

      if (scene) {
        return scene
          .items((ops) => redo(ops.where((q) => q.withItemId(itemId))))
          .execute();
      }
    },
    async undo(): Promise<void> {
      const scene = await viewer.current?.scene();

      if (scene) {
        return scene
          .items((ops) => undo(ops.where((q) => q.withItemId(itemId))))
          .execute();
      }
    },
  };
}
