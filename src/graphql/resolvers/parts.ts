/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Resolvers } from "../../generated/graphql/resolvers";
import { fromApi } from "../model/part";

export const parts: Resolvers = {
  Query: {
    async part(_, { partId }, ctx) {
      const res = await ctx.vertexApi.parts.getPart({
        id: partId,
      });

      return fromApi(res.data);
    },
  },
};
