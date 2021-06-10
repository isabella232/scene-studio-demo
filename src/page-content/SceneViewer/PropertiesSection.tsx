import classNames from "classnames";
import React from "react";

import { Collapsible } from "../../components/Collapsible";
import {
  SceneViewItem,
  usePartQuery,
  usePartRevisionQuery,
} from "../../generated/graphql/react";

interface Props {
  sceneViewItem?: SceneViewItem | null;
}

export function PropertiesSection({ sceneViewItem }: Props): JSX.Element {
  const { data: partRevisionData, loading: partRevisionLoading } =
    usePartRevisionQuery({
      variables: {
        revisionId: sceneViewItem?.partRevisionId || "",
      },
      fetchPolicy: "cache-first",
      skip: sceneViewItem == null || sceneViewItem.partRevisionId == null,
    });
  const { data: partData, loading: partDataLoading } = usePartQuery({
    variables: {
      partId: partRevisionData?.partRevision?.partId || "",
    },
    fetchPolicy: "cache-first",
    skip:
      sceneViewItem == null || partRevisionData?.partRevision?.partId == null,
  });

  const dataLoading = partDataLoading || partRevisionLoading;

  return (
    <div className="w-full px-2 border-b">
      <Collapsible title="PROPERTIES">
        <div className={classNames("mb-4 relative text-sm text-neutral-700")}>
          {sceneViewItem?.partRevisionId != null &&
            partData?.part == null &&
            dataLoading &&
            placeholder("Loading...")}
          {sceneViewItem == null && placeholder("No part selected.")}
          <div className="flex items-center pb-2 text-lg">
            {getSelectedDisplay(
              "name",
              partData?.part,
              sceneViewItem,
              partDataLoading
            )}
          </div>
          <div className="flex items-center py-2 font-medium">Part ID</div>
          <div className="mb-4">
            {getSelectedDisplay(
              "id",
              partData?.part,
              sceneViewItem,
              partDataLoading
            )}
          </div>
          <div className="flex items-center py-2 font-medium">
            Part Revision ID
          </div>
          <div className="mb-4">
            {getSelectedDisplay(
              "id",
              partRevisionData?.partRevision,
              sceneViewItem,
              partRevisionLoading
            )}
          </div>
          <div className="flex items-center py-2 font-medium">
            Scene Item ID
          </div>
          <div className="mb-4">
            {getSelectedDisplay("id", sceneViewItem, sceneViewItem)}
          </div>
          <div className="flex flex-col py-2 font-medium">Supplied IDs</div>
          <div>Scene Item:</div>
          <div className="mb-2">
            {getSelectedDisplay("suppliedId", sceneViewItem, sceneViewItem)}
          </div>
          <div>Part Revision:</div>
          <div className="mb-2">
            {getSelectedDisplay(
              "suppliedId",
              partRevisionData?.partRevision,
              sceneViewItem,
              partRevisionLoading
            )}
          </div>
          <div>Part:</div>
          <div className="mb-2">
            {getSelectedDisplay(
              "suppliedId",
              partData?.part,
              sceneViewItem,
              partDataLoading
            )}
          </div>
        </div>
      </Collapsible>
    </div>
  );
}

function placeholder(children: React.ReactNode): JSX.Element {
  return (
    <div className="flex w-full h-full items-center justify-center absolute bg-white">
      {children}
    </div>
  );
}

function getSelectedDisplay<T extends Record<string, unknown>>(
  field: keyof T,
  item?: T | null,
  sceneViewItem?: SceneViewItem | null,
  itemLoading?: boolean
): string {
  if (!itemLoading && sceneViewItem) {
    const value = item != null ? item[field] : undefined;
    return typeof value === "string" && value !== ""
      ? value
      : `No ${field} found`;
  } else {
    return "Loading...";
  }
}
