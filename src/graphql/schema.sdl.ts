import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  scalar Date

  type ColorMaterial {
    opacity: Float!
    glossiness: Float!
    diffuse: String!
    ambient: String!
    specular: String!
    emissive: String!
  }

  type Vector3 {
    x: Float!
    y: Float!
    z: Float!
  }

  type Transform {
    position: Vector3!
    rotation: Vector3!
    scale: Float!
  }

  type SceneViewItem {
    id: ID!
    suppliedId: String
    visible: Boolean!
    selected: Boolean!
    transform: Transform!
    materialOverride: ColorMaterial
    worldTransform(sceneViewId: ID!, itemId: ID!): [Float]
    partRevisionId: ID
  }

  type PartRevision {
    id: ID!
    partId: ID
    created: Date
    suppliedId: String
  }

  type Part {
    id: ID!
    name: String!
    created: Date
    suppliedId: String
  }

  type Query {
    sceneViewItem(sceneViewId: ID!, itemId: ID!): SceneViewItem
    partRevision(revisionId: ID!): PartRevision
    part(partId: ID!): Part
  }

  input Vector3Input {
    x: Float!
    y: Float!
    z: Float!
  }

  input CameraInput {
    position: Vector3Input!
    up: Vector3Input!
    lookAt: Vector3Input!
  }

  type Mutation {
    save(enabled: Boolean!, sceneViewId: ID!, camera: CameraInput): Boolean!
  }
`;
