import { ApolloClient, ApolloQueryResult, InMemoryCache } from "@apollo/client";

import {
  PartDocument,
  PartQuery,
  PartQueryVariables,
  PartRevisionDocument,
  PartRevisionQuery,
  PartRevisionQueryVariables,
  SceneViewItemDocument,
  SceneViewItemFullTransformDocument,
  SceneViewItemFullTransformQuery,
  SceneViewItemFullTransformQueryVariables,
  SceneViewItemQuery,
  SceneViewItemQueryVariables,
} from "../generated/graphql/react";
import { config } from "./config";

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  uri: config.local
    ? "http://localhost:3000/api/graphql"
    : "https://scene-studio.vertexvis.io/api/graphql",
  cache,
});

export function fetchSceneViewItem(
  sceneViewId: string,
  itemId: string
): Promise<ApolloQueryResult<SceneViewItemQuery>> {
  return client.query<SceneViewItemQuery, SceneViewItemQueryVariables>({
    query: SceneViewItemDocument,
    variables: { itemId, sceneViewId },
  });
}

export function fetchSceneViewItemFullTransform(
  sceneViewId: string,
  itemId: string
): Promise<ApolloQueryResult<SceneViewItemFullTransformQuery>> {
  return client.query<
    SceneViewItemFullTransformQuery,
    SceneViewItemFullTransformQueryVariables
  >({
    query: SceneViewItemFullTransformDocument,
    variables: { sceneViewId, itemId },
  });
}

export function fetchPartRevision(
  revisionId: string
): Promise<ApolloQueryResult<PartRevisionQuery>> {
  return client.query<PartRevisionQuery, PartRevisionQueryVariables>({
    query: PartRevisionDocument,
    variables: { revisionId },
  });
}

export function fetchPart(
  partId: string
): Promise<ApolloQueryResult<PartQuery>> {
  return client.query<PartQuery, PartQueryVariables>({
    query: PartDocument,
    variables: { partId },
  });
}
