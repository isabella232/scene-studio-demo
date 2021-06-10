import { Part as ApiPart } from "@vertexvis/vertex-api-client";

import { Part } from "../../generated/graphql/react";

export function fromApi({ data }: ApiPart): Part {
  return {
    id: data.id,
    name: data.attributes.name,
    created: data.attributes.created,
    suppliedId: data.attributes.suppliedId,
  };
}
