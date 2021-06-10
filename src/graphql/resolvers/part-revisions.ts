/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Resolvers } from "../../generated/graphql/resolvers";
import { fromApi } from "../model/part-revision";

export const partRevisions: Resolvers = {
  Query: {
    async partRevision(_, { revisionId }, ctx) {
      const res = await ctx.vertexApi.partRevisions.getPartRevision({
        id: revisionId,
      });

      return fromApi(res.data);
    },
  },
};
