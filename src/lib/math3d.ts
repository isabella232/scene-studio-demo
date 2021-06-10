import { Vector3 } from "@vertexvis/geometry";
import { Matrix4x4, Quaternion, Vector3 as Math3dVector3 } from "math3d";

import { Transform } from "../generated/graphql/react";

export function scale(matrix4: number[]): number {
  const xScale = parseFloat(
    Math.sqrt(matrix4[0] ** 2 + matrix4[1] ** 2 + matrix4[2] ** 2).toFixed(2)
  );
  const yScale = parseFloat(
    Math.sqrt(matrix4[4] ** 2 + matrix4[5] ** 2 + matrix4[6] ** 2).toFixed(2)
  );
  const zScale = parseFloat(
    Math.sqrt(matrix4[8] ** 2 + matrix4[9] ** 2 + matrix4[10] ** 2).toFixed(2)
  );
  if (xScale === yScale && yScale === zScale) {
    return xScale;
  } else {
    return NaN;
  }
}

export function translation(matrix4: number[]): Vector3.Vector3 {
  return {
    x: matrix4[3],
    y: matrix4[7],
    z: matrix4[11],
  };
}

export function rotation(matrix4: number[]): Vector3.Vector3 {
  const matrix = new Matrix4x4(matrix4);
  const rotationMatrix = matrix.mulScalar(1.0 / scale(matrix4));
  if (rotationMatrix.m13 < 1) {
    if (rotationMatrix.m13 > -1) {
      return {
        x:
          Math.atan2(-rotationMatrix.m23, rotationMatrix.m33) * (180 / Math.PI),
        y: Math.asin(rotationMatrix.m13) * (180 / Math.PI),
        z:
          Math.atan2(-rotationMatrix.m12, rotationMatrix.m11) * (180 / Math.PI),
      };
    } else {
      return {
        x:
          -Math.atan2(-rotationMatrix.m21, rotationMatrix.m22) *
          (180 / Math.PI),
        y: -90,
        z: 0,
      };
    }
  } else {
    return {
      x: Math.atan2(rotationMatrix.m21, rotationMatrix.m22) * (180 / Math.PI),
      y: 90,
      z: 0,
    };
  }
}

export function toMatrix({ position, rotation, scale }: Transform): number[] {
  const translation = new Math3dVector3(position.x, position.y, position.z);
  const rot = Quaternion.Euler(rotation.x, rotation.y, rotation.z);
  return Matrix4x4.TRS(translation, rot, scale).values;
}
