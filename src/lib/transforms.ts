import { Dimensions, Point, Vector3 } from "@vertexvis/geometry";
import { Camera } from "@vertexvis/viewer/dist/types/scenes";
import * as Math3d from "math3d";

import { SceneViewItem, Transform } from "../generated/graphql/react";
import { rotation,scale } from "./math3d";

export const calculateTranslation = (
  camera: Camera,
  originPoint: Point.Point,
  currentPoint: Point.Point,
  dimensions: Dimensions.Dimensions,
  sceneViewItem: Pick<SceneViewItem, "transform" | "worldTransform">
): Transform => {
  const viewVector = camera.viewVector();
  const normalizedViewVector = Vector3.normalize(viewVector);
  const screenPlaneWorldHeight =
    Vector3.magnitude(Vector3.subtract(camera.lookAt, camera.position)) *
    Math.tan((Math.PI / 180) * camera.fovY);
  const screenPlaneWorldWidth = camera.aspectRatio * screenPlaneWorldHeight;

  const percentWidth = (currentPoint.x - originPoint.x) / dimensions.width;
  const percentHeight = (currentPoint.y - originPoint.y) / dimensions.height;

  const dx = (percentWidth - percentWidth * 0.2) * screenPlaneWorldWidth;
  const dy = (percentHeight - percentHeight * 0.2) * screenPlaneWorldHeight;

  const cameraX = Vector3.cross(camera.up, normalizedViewVector);
  const cameraY = Vector3.cross(normalizedViewVector, cameraX);

  const translationVector = Vector3.add(
    Vector3.scale(dx, Vector3.normalize(cameraX)),
    Vector3.scale(dy, Vector3.normalize(cameraY))
  );

  return {
    ...sceneViewItem.transform,
    position: worldToLocalTranslate(
      translationVector,
      sceneViewItem.transform,
      sceneViewItem.worldTransform as number[]
    ),
  };
};

export const worldToLocalTranslate = (
  worldTranslation: Vector3.Vector3,
  local: Transform,
  world: number[]
): Vector3.Vector3 => {
  const matrix = new Math3d.Matrix4x4(world);
  const worldScale = scale(matrix.values);
  const worldRotation = rotation(matrix.values);

  const translationMatrix = new Math3d.Transform(
    new Math3d.Vector3(
      worldTranslation.x / worldScale,
      worldTranslation.y / worldScale,
      worldTranslation.z / worldScale
    ),
    Math3d.Quaternion.Euler(0, 0, worldRotation.z)
      .mul(Math3d.Quaternion.Euler(0, worldRotation.y, 0))
      .mul(Math3d.Quaternion.Euler(worldRotation.x, 0, 0))
  ).worldToLocalMatrix.values;

  return {
    x: local.position.x + translationMatrix[3],
    y: local.position.y + translationMatrix[7],
    z: local.position.z + translationMatrix[11],
  };
};
