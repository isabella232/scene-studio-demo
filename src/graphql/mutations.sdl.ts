import { gql } from "@apollo/client";

export default gql`
  mutation SaveSceneView(
    $enabled: Boolean!
    $sceneViewId: ID!
    $camera: CameraInput
  ) {
    save(enabled: $enabled, sceneViewId: $sceneViewId, camera: $camera)
  }
`;
