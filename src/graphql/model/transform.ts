import { Matrix4 } from "@vertexvis/vertex-api-client";

import { Transform } from "../../generated/graphql/react";
import { rotation, scale, translation } from "../../lib/math3d";

export function toTransformFromApiMatrix(
  matrix: Matrix4 | undefined
): Transform | undefined {
  if (matrix != null) {
    const arr = toArrayFromApiMatrix(matrix);
    return {
      position: translation(arr),
      rotation: rotation(arr),
      scale: scale(arr),
    };
  } else {
    return undefined;
  }
}

export function toArrayFromApiMatrix(matrix: Matrix4): number[] {
  return [
    matrix.r0.x,
    matrix.r0.y,
    matrix.r0.z,
    matrix.r0.w,
    matrix.r1.x,
    matrix.r1.y,
    matrix.r1.z,
    matrix.r1.w,
    matrix.r2.x,
    matrix.r2.y,
    matrix.r2.z,
    matrix.r2.w,
    matrix.r3.x,
    matrix.r3.y,
    matrix.r3.z,
    matrix.r3.w,
  ];
}
