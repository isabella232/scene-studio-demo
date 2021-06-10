/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Resolvers } from "../../generated/graphql/resolvers";

export const save: Resolvers = {
  Mutation: {
    async save(_, { sceneViewId, camera, enabled }, ctx) {
      if (!enabled) return false;

      const res = await ctx.vertexApi.sceneItemOverrides.getSceneItemOverrides({
        id: sceneViewId,
      });

      const { data: overrides } = res.data;
      const saves = overrides.map(({ attributes, relationships }) => {
        return ctx.vertexApi.sceneItems.updateSceneItem({
          id: relationships.sceneItem.data.id,
          updateSceneItemRequest: {
            data: {
              type: "update-scene-item-request",
              attributes: {
                visible: attributes.visible,
                transform: attributes.transform,
                materialOverride: { value: attributes.material },
              },
            },
          },
        });
      });
      const deletes = overrides.map(({ id }) => {
        return ctx.vertexApi.sceneItemOverrides.deleteSceneItemOverride({ id });
      });
      const cameraUpdate = new Promise<void>((resolve) => {
        if (camera == null) return resolve();

        ctx.vertexApi.sceneViews
          .getSceneView({
            id: sceneViewId,
          })
          .then((view) =>
            ctx.vertexApi.scenes.updateScene({
              id: view.data.data.relationships.scene.data.id,
              updateSceneRequest: {
                data: {
                  type: "scene",
                  attributes: { camera },
                },
              },
            })
          )
          .then(() => resolve());
      });

      await Promise.all(saves);
      await Promise.all(deletes);
      await cameraUpdate;

      return true;
    },
  },
};
