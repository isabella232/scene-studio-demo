/* eslint-disable */
import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type CameraInput = {
  position: Vector3Input;
  up: Vector3Input;
  lookAt: Vector3Input;
};

export type ColorMaterial = {
  __typename?: "ColorMaterial";
  opacity: Scalars["Float"];
  glossiness: Scalars["Float"];
  diffuse: Scalars["String"];
  ambient: Scalars["String"];
  specular: Scalars["String"];
  emissive: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  save: Scalars["Boolean"];
};

export type MutationSaveArgs = {
  enabled: Scalars["Boolean"];
  sceneViewId: Scalars["ID"];
  camera?: Maybe<CameraInput>;
};

export type Part = {
  __typename?: "Part";
  id: Scalars["ID"];
  name: Scalars["String"];
  created?: Maybe<Scalars["Date"]>;
  suppliedId?: Maybe<Scalars["String"]>;
};

export type PartRevision = {
  __typename?: "PartRevision";
  id: Scalars["ID"];
  partId?: Maybe<Scalars["ID"]>;
  created?: Maybe<Scalars["Date"]>;
  suppliedId?: Maybe<Scalars["String"]>;
};

export type Query = {
  __typename?: "Query";
  sceneViewItem?: Maybe<SceneViewItem>;
  partRevision?: Maybe<PartRevision>;
  part?: Maybe<Part>;
};

export type QuerySceneViewItemArgs = {
  sceneViewId: Scalars["ID"];
  itemId: Scalars["ID"];
};

export type QueryPartRevisionArgs = {
  revisionId: Scalars["ID"];
};

export type QueryPartArgs = {
  partId: Scalars["ID"];
};

export type SceneViewItem = {
  __typename?: "SceneViewItem";
  id: Scalars["ID"];
  suppliedId?: Maybe<Scalars["String"]>;
  visible: Scalars["Boolean"];
  selected: Scalars["Boolean"];
  transform: Transform;
  materialOverride?: Maybe<ColorMaterial>;
  worldTransform?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  partRevisionId?: Maybe<Scalars["ID"]>;
};

export type SceneViewItemWorldTransformArgs = {
  sceneViewId: Scalars["ID"];
  itemId: Scalars["ID"];
};

export type Transform = {
  __typename?: "Transform";
  position: Vector3;
  rotation: Vector3;
  scale: Scalars["Float"];
};

export type Vector3 = {
  __typename?: "Vector3";
  x: Scalars["Float"];
  y: Scalars["Float"];
  z: Scalars["Float"];
};

export type Vector3Input = {
  x: Scalars["Float"];
  y: Scalars["Float"];
  z: Scalars["Float"];
};

export type SaveSceneViewMutationVariables = Exact<{
  enabled: Scalars["Boolean"];
  sceneViewId: Scalars["ID"];
  camera?: Maybe<CameraInput>;
}>;

export type SaveSceneViewMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "save"
>;

export type SceneViewItemQueryVariables = Exact<{
  sceneViewId: Scalars["ID"];
  itemId: Scalars["ID"];
}>;

export type SceneViewItemQuery = { __typename?: "Query" } & {
  sceneViewItem?: Maybe<
    { __typename?: "SceneViewItem" } & Pick<
      SceneViewItem,
      "id" | "suppliedId" | "visible" | "selected" | "partRevisionId"
    > & {
        transform: { __typename?: "Transform" } & Pick<Transform, "scale"> & {
            position: { __typename?: "Vector3" } & Pick<
              Vector3,
              "x" | "y" | "z"
            >;
            rotation: { __typename?: "Vector3" } & Pick<
              Vector3,
              "x" | "y" | "z"
            >;
          };
        materialOverride?: Maybe<
          { __typename?: "ColorMaterial" } & Pick<
            ColorMaterial,
            | "opacity"
            | "glossiness"
            | "diffuse"
            | "ambient"
            | "specular"
            | "emissive"
          >
        >;
      }
  >;
};

export type SceneViewItemFullTransformQueryVariables = Exact<{
  sceneViewId: Scalars["ID"];
  itemId: Scalars["ID"];
}>;

export type SceneViewItemFullTransformQuery = { __typename?: "Query" } & {
  sceneViewItem?: Maybe<
    { __typename?: "SceneViewItem" } & Pick<
      SceneViewItem,
      "id" | "suppliedId" | "visible" | "worldTransform" | "partRevisionId"
    > & {
        transform: { __typename?: "Transform" } & Pick<Transform, "scale"> & {
            position: { __typename?: "Vector3" } & Pick<
              Vector3,
              "x" | "y" | "z"
            >;
            rotation: { __typename?: "Vector3" } & Pick<
              Vector3,
              "x" | "y" | "z"
            >;
          };
        materialOverride?: Maybe<
          { __typename?: "ColorMaterial" } & Pick<
            ColorMaterial,
            | "opacity"
            | "glossiness"
            | "diffuse"
            | "ambient"
            | "specular"
            | "emissive"
          >
        >;
      }
  >;
};

export type PartRevisionQueryVariables = Exact<{
  revisionId: Scalars["ID"];
}>;

export type PartRevisionQuery = { __typename?: "Query" } & {
  partRevision?: Maybe<
    { __typename?: "PartRevision" } & Pick<
      PartRevision,
      "id" | "partId" | "suppliedId"
    >
  >;
};

export type PartQueryVariables = Exact<{
  partId: Scalars["ID"];
}>;

export type PartQuery = { __typename?: "Query" } & {
  part?: Maybe<
    { __typename?: "Part" } & Pick<Part, "id" | "name" | "suppliedId">
  >;
};

export type MaterialOverrideSceneViewItemFragment = {
  __typename?: "SceneViewItem";
} & {
  materialOverride?: Maybe<
    { __typename?: "ColorMaterial" } & Pick<
      ColorMaterial,
      "opacity" | "glossiness" | "ambient" | "diffuse" | "emissive" | "specular"
    >
  >;
};

export type TransformSceneViewItemFragment = {
  __typename?: "SceneViewItem";
} & {
  transform: { __typename?: "Transform" } & Pick<Transform, "scale"> & {
      position: { __typename?: "Vector3" } & Pick<Vector3, "x" | "y" | "z">;
      rotation: { __typename?: "Vector3" } & Pick<Vector3, "x" | "y" | "z">;
    };
};

export type FullSceneViewItemFragment = { __typename?: "SceneViewItem" } & Pick<
  SceneViewItem,
  "id" | "visible"
> &
  MaterialOverrideSceneViewItemFragment &
  TransformSceneViewItemFragment;

export type HideSceneViewItemFragment = { __typename?: "SceneViewItem" } & Pick<
  SceneViewItem,
  "visible"
>;

export type SelectSceneViewItemFragment = {
  __typename?: "SceneViewItem";
} & Pick<SceneViewItem, "selected">;

export const MaterialOverrideSceneViewItemFragmentDoc = gql`
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
export const TransformSceneViewItemFragmentDoc = gql`
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
export const FullSceneViewItemFragmentDoc = gql`
  fragment FullSceneViewItem on SceneViewItem {
    id
    visible
    ...MaterialOverrideSceneViewItem
    ...TransformSceneViewItem
  }
  ${MaterialOverrideSceneViewItemFragmentDoc}
  ${TransformSceneViewItemFragmentDoc}
`;
export const HideSceneViewItemFragmentDoc = gql`
  fragment HideSceneViewItem on SceneViewItem {
    visible
  }
`;
export const SelectSceneViewItemFragmentDoc = gql`
  fragment SelectSceneViewItem on SceneViewItem {
    selected
  }
`;
export const SaveSceneViewDocument = gql`
  mutation SaveSceneView(
    $enabled: Boolean!
    $sceneViewId: ID!
    $camera: CameraInput
  ) {
    save(enabled: $enabled, sceneViewId: $sceneViewId, camera: $camera)
  }
`;
export type SaveSceneViewMutationFn = Apollo.MutationFunction<
  SaveSceneViewMutation,
  SaveSceneViewMutationVariables
>;

/**
 * __useSaveSceneViewMutation__
 *
 * To run a mutation, you first call `useSaveSceneViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveSceneViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveSceneViewMutation, { data, loading, error }] = useSaveSceneViewMutation({
 *   variables: {
 *      enabled: // value for 'enabled'
 *      sceneViewId: // value for 'sceneViewId'
 *      camera: // value for 'camera'
 *   },
 * });
 */
export function useSaveSceneViewMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SaveSceneViewMutation,
    SaveSceneViewMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SaveSceneViewMutation,
    SaveSceneViewMutationVariables
  >(SaveSceneViewDocument, options);
}
export type SaveSceneViewMutationHookResult = ReturnType<
  typeof useSaveSceneViewMutation
>;
export type SaveSceneViewMutationResult =
  Apollo.MutationResult<SaveSceneViewMutation>;
export type SaveSceneViewMutationOptions = Apollo.BaseMutationOptions<
  SaveSceneViewMutation,
  SaveSceneViewMutationVariables
>;
export const SceneViewItemDocument = gql`
  query SceneViewItem($sceneViewId: ID!, $itemId: ID!) {
    sceneViewItem(sceneViewId: $sceneViewId, itemId: $itemId) {
      id
      suppliedId
      visible
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
      materialOverride {
        opacity
        glossiness
        diffuse
        ambient
        specular
        emissive
      }
      selected
      partRevisionId
    }
  }
`;

/**
 * __useSceneViewItemQuery__
 *
 * To run a query within a React component, call `useSceneViewItemQuery` and pass it any options that fit your needs.
 * When your component renders, `useSceneViewItemQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSceneViewItemQuery({
 *   variables: {
 *      sceneViewId: // value for 'sceneViewId'
 *      itemId: // value for 'itemId'
 *   },
 * });
 */
export function useSceneViewItemQuery(
  baseOptions: Apollo.QueryHookOptions<
    SceneViewItemQuery,
    SceneViewItemQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SceneViewItemQuery, SceneViewItemQueryVariables>(
    SceneViewItemDocument,
    options
  );
}
export function useSceneViewItemLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SceneViewItemQuery,
    SceneViewItemQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SceneViewItemQuery, SceneViewItemQueryVariables>(
    SceneViewItemDocument,
    options
  );
}
export type SceneViewItemQueryHookResult = ReturnType<
  typeof useSceneViewItemQuery
>;
export type SceneViewItemLazyQueryHookResult = ReturnType<
  typeof useSceneViewItemLazyQuery
>;
export type SceneViewItemQueryResult = Apollo.QueryResult<
  SceneViewItemQuery,
  SceneViewItemQueryVariables
>;
export const SceneViewItemFullTransformDocument = gql`
  query SceneViewItemFullTransform($sceneViewId: ID!, $itemId: ID!) {
    sceneViewItem(sceneViewId: $sceneViewId, itemId: $itemId) {
      id
      suppliedId
      visible
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
      materialOverride {
        opacity
        glossiness
        diffuse
        ambient
        specular
        emissive
      }
      worldTransform(sceneViewId: $sceneViewId, itemId: $itemId)
      partRevisionId
    }
  }
`;

/**
 * __useSceneViewItemFullTransformQuery__
 *
 * To run a query within a React component, call `useSceneViewItemFullTransformQuery` and pass it any options that fit your needs.
 * When your component renders, `useSceneViewItemFullTransformQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSceneViewItemFullTransformQuery({
 *   variables: {
 *      sceneViewId: // value for 'sceneViewId'
 *      itemId: // value for 'itemId'
 *   },
 * });
 */
export function useSceneViewItemFullTransformQuery(
  baseOptions: Apollo.QueryHookOptions<
    SceneViewItemFullTransformQuery,
    SceneViewItemFullTransformQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SceneViewItemFullTransformQuery,
    SceneViewItemFullTransformQueryVariables
  >(SceneViewItemFullTransformDocument, options);
}
export function useSceneViewItemFullTransformLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SceneViewItemFullTransformQuery,
    SceneViewItemFullTransformQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SceneViewItemFullTransformQuery,
    SceneViewItemFullTransformQueryVariables
  >(SceneViewItemFullTransformDocument, options);
}
export type SceneViewItemFullTransformQueryHookResult = ReturnType<
  typeof useSceneViewItemFullTransformQuery
>;
export type SceneViewItemFullTransformLazyQueryHookResult = ReturnType<
  typeof useSceneViewItemFullTransformLazyQuery
>;
export type SceneViewItemFullTransformQueryResult = Apollo.QueryResult<
  SceneViewItemFullTransformQuery,
  SceneViewItemFullTransformQueryVariables
>;
export const PartRevisionDocument = gql`
  query PartRevision($revisionId: ID!) {
    partRevision(revisionId: $revisionId) {
      id
      partId
      suppliedId
    }
  }
`;

/**
 * __usePartRevisionQuery__
 *
 * To run a query within a React component, call `usePartRevisionQuery` and pass it any options that fit your needs.
 * When your component renders, `usePartRevisionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePartRevisionQuery({
 *   variables: {
 *      revisionId: // value for 'revisionId'
 *   },
 * });
 */
export function usePartRevisionQuery(
  baseOptions: Apollo.QueryHookOptions<
    PartRevisionQuery,
    PartRevisionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PartRevisionQuery, PartRevisionQueryVariables>(
    PartRevisionDocument,
    options
  );
}
export function usePartRevisionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PartRevisionQuery,
    PartRevisionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PartRevisionQuery, PartRevisionQueryVariables>(
    PartRevisionDocument,
    options
  );
}
export type PartRevisionQueryHookResult = ReturnType<
  typeof usePartRevisionQuery
>;
export type PartRevisionLazyQueryHookResult = ReturnType<
  typeof usePartRevisionLazyQuery
>;
export type PartRevisionQueryResult = Apollo.QueryResult<
  PartRevisionQuery,
  PartRevisionQueryVariables
>;
export const PartDocument = gql`
  query Part($partId: ID!) {
    part(partId: $partId) {
      id
      name
      suppliedId
    }
  }
`;

/**
 * __usePartQuery__
 *
 * To run a query within a React component, call `usePartQuery` and pass it any options that fit your needs.
 * When your component renders, `usePartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePartQuery({
 *   variables: {
 *      partId: // value for 'partId'
 *   },
 * });
 */
export function usePartQuery(
  baseOptions: Apollo.QueryHookOptions<PartQuery, PartQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PartQuery, PartQueryVariables>(PartDocument, options);
}
export function usePartLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PartQuery, PartQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PartQuery, PartQueryVariables>(
    PartDocument,
    options
  );
}
export type PartQueryHookResult = ReturnType<typeof usePartQuery>;
export type PartLazyQueryHookResult = ReturnType<typeof usePartLazyQuery>;
export type PartQueryResult = Apollo.QueryResult<PartQuery, PartQueryVariables>;
