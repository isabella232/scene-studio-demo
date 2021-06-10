import { gql } from "graphql-request";

export default gql`
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
  query PartRevision($revisionId: ID!) {
    partRevision(revisionId: $revisionId) {
      id
      partId
      suppliedId
    }
  }
  query Part($partId: ID!) {
    part(partId: $partId) {
      id
      name
      suppliedId
    }
  }
`;
