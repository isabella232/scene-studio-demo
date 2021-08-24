import { PartRevision as ApiPartRevision } from "@vertexvis/api-client-node";

import { PartRevision } from "../../generated/graphql/react";

export function fromApi({ data }: ApiPartRevision): PartRevision {
  return {
    id: data.id,
    created: data.attributes.created,
    suppliedId: data.attributes.suppliedId,
    partId: data.relationships.part?.id,
  };
}
