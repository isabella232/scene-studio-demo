import { TapEventDetails } from "@vertexvis/viewer";
import type {
  JSX as ViewerJSX,
  VertexViewerCustomEvent,
} from "@vertexvis/viewer";
import {
  VertexViewer,
  VertexViewerToolbar,
  VertexViewerViewCube,
} from "@vertexvis/viewer-react";
import React, { RefAttributes } from "react";

import { SceneViewItem } from "../generated/graphql/react";
import { StreamCredentials } from "../lib/env";
import { fetchSceneViewItem } from "../lib/graphql";

export interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly credentials: StreamCredentials;
  readonly viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
  readonly viewerId: string;
}

export type ViewerComponentType = React.ComponentType<
  ViewerProps & RefAttributes<HTMLVertexViewerElement>
>;

export type HOCViewerProps = RefAttributes<HTMLVertexViewerElement>;

export const AnimationDurationMs = 1500;

export function Viewer({
  credentials,
  viewer,
  viewerId,
  ...props
}: ViewerProps): JSX.Element {
  return (
    <VertexViewer
      className="w-full h-full"
      clientId={credentials.clientId}
      ref={viewer}
      src={`urn:vertexvis:stream-key:${credentials.streamKey}`}
      id={viewerId}
      {...props}
    >
      <VertexViewerToolbar placement="top-right">
        <VertexViewerViewCube
          animationDuration={AnimationDurationMs}
          viewer={viewer.current ?? undefined}
        />
      </VertexViewerToolbar>
    </VertexViewer>
  );
}

export interface FetchItemOnTapProps extends HOCViewerProps {
  onSelect: (item?: Pick<SceneViewItem, "id" | "transform">) => void;
}

export function fetchItemOnTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): React.FunctionComponent<P & FetchItemOnTapProps> {
  return function Component({ viewer, onSelect, ...props }) {
    return (
      <WrappedViewer
        viewer={viewer}
        {...props}
        onTap={async (event: VertexViewerCustomEvent<TapEventDetails>) => {
          // Forward event to onTap handler passed on props
          if (props.onTap) {
            props.onTap(event);
          }

          if (!event.defaultPrevented) {
            const scene = await viewer.current?.scene();
            const viewId = scene?.sceneViewId;
            const raycaster = scene?.raycaster();

            if (raycaster != null && viewId != null) {
              const res = await raycaster.hitItems(event.detail.position);
              const hit = (res?.hits || [])[0];

              if (hit?.itemId?.hex != null) {
                const item = await fetchSceneViewItem(viewId, hit.itemId.hex);
                if (item.data.sceneViewItem != null) {
                  onSelect(item.data.sceneViewItem);
                }
              } else {
                onSelect(undefined);
              }
            }
          }
        }}
      />
    );
  };
}
