/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Matrix4 } from "@vertexvis/api-client-node";
import * as Math3d from "math3d";

import { Resolvers } from "../../generated/graphql/resolvers";
import { fromApi } from "../model/scene-view-item";
import { toArrayFromApiMatrix } from "../model/transform";

export const sceneViewItems: Resolvers = {
  SceneViewItem: {
    worldTransform: async (_, args, ctx) => {
      const res = await ctx.vertexApi.sceneViews.getViewSceneItem({
        id: args.sceneViewId,
        itemId: args.itemId,
        fieldsSceneItem: "transform",
      });

      let currentItem = res.data.data;
      let transformSet: Array<Matrix4> =
        currentItem.attributes.transform != null
          ? [currentItem.attributes.transform]
          : [];
      while (currentItem.relationships.parent?.data.id != null) {
        // eslint-disable-next-line no-await-in-loop
        const parentRes = await ctx.vertexApi.sceneViews.getViewSceneItem({
          id: args.sceneViewId,
          itemId: currentItem.relationships.parent?.data.id,
          fieldsSceneItem: "transform",
        });
        currentItem = parentRes.data.data;
        transformSet =
          currentItem.attributes.transform != null
            ? [...transformSet, currentItem.attributes.transform]
            : [];
      }
      const worldTransform = transformSet
        .reverse()
        .map(toArrayFromApiMatrix)
        .reduce((res, t) => {
          return new Math3d.Matrix4x4(t).mul(res);
        }, Math3d.Matrix4x4.identity);
      return worldTransform.values;
    },
  },
  Query: {
    async sceneViewItem(_, { sceneViewId, itemId }, ctx) {
      const res = await ctx.vertexApi.sceneViews.getViewSceneItem({
        id: sceneViewId,
        itemId: itemId,
        fieldsSceneItem: "suppliedId,visible,transform,materialOverride",
        include: "sceneItemOverride",
      });

      return fromApi(res.data);
    },
  },
};
