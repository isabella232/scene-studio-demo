import { VertexClient } from "@vertexvis/vertex-api-client";
import { ApolloServer } from "apollo-server-micro";

import { GraphQLContext } from "../../graphql/context";
import { resolvers } from "../../graphql/resolvers";
import { typeDefs } from "../../graphql/schema.sdl";
import { config as apiConfig } from "../../lib/config";

async function createContext(): Promise<GraphQLContext> {
  const vertexApi = await VertexClient.build({
    basePath: apiConfig.basePath,
    client: { id: apiConfig.clientId, secret: apiConfig.clientSecret },
  });

  return { vertexApi };
}

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
});

export const config = { api: { bodyParser: false } };

export default server.createHandler({ path: "/api/graphql" });
