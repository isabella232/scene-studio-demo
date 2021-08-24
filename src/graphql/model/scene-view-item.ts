import {
  ColorMaterial as ApiColorMaterial,
  SceneItemData,
  SceneItemOverrideData,
  SceneViewItem as ApiSceneViewItem,
} from "@vertexvis/api-client-node";
import { Color } from "@vertexvis/utils";

import {
  ColorMaterial,
  SceneViewItem,
} from "../../generated/graphql/resolvers";
import { toTransformFromApiMatrix } from "./transform";

export function fromApi({
  data,
  included = [],
}: ApiSceneViewItem): SceneViewItem {
  const item = fromApiSceneItemData(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coercedIncluded = included as any[];

  return coercedIncluded.reduce(
    (res, { value: override }) => applyOverrideData(res, override),
    item
  );
}

function fromApiSceneItemData({
  id,
  attributes,
  relationships,
}: SceneItemData): SceneViewItem {
  const { visible, suppliedId } = attributes;
  const transform = toTransformFromApiMatrix(attributes.transform);
  const materialOverride = toMaterialOverrideFromApiMaterial(
    attributes.materialOverride
  );
  const partRevisionId =
    relationships.source?.data.type === "part-revision"
      ? relationships.source?.data.id
      : undefined;
  if (visible != null && transform != null) {
    return {
      id,
      suppliedId,
      partRevisionId,
      visible,
      selected: false,
      transform,
      materialOverride,
    };
  } else {
    throw new Error("Missing fields");
  }
}

function applyOverrideData(
  item: SceneViewItem,
  { attributes }: SceneItemOverrideData
): SceneViewItem {
  const transform = toTransformFromApiMatrix(attributes.transform);
  const materialOverride = toMaterialOverrideFromApiMaterial(
    attributes.material
  );
  return {
    ...item,
    visible: attributes.visible || item.visible,
    transform: transform || item.transform,
    materialOverride: materialOverride || item.materialOverride,
  };
}

function toMaterialOverrideFromApiMaterial(
  material: ApiColorMaterial | undefined
): ColorMaterial | undefined {
  if (material != null) {
    return {
      opacity: material.opacity,
      glossiness: material.glossiness,
      diffuse: Color.toHexString(material.diffuse),
      ambient: Color.toHexString(material.ambient),
      specular: Color.toHexString(material.specular),
      emissive: Color.toHexString(material.emissive),
    };
  } else {
    return undefined;
  }
}
