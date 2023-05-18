import { InMemoryCache } from "@apollo/client";
import { Dimensions, Point } from "@vertexvis/geometry";
import React from "react";

import { FetchItemOnTapProps, ViewerProps } from "../../components/Viewer";
import { SceneViewItem } from "../../generated/graphql/react";
import { fetchSceneViewItemFullTransform } from "../../lib/graphql";
import { calculateTranslation } from "../../lib/transforms";
import { UndoManager } from "../../lib/undo";
import { transform } from "../../lib/undo-commands";
import type { VertexViewerCustomEvent } from "@vertexvis/viewer";

export interface TranslateOnMoveProps extends ViewerProps {
  undoStack: UndoManager;
  cache: InMemoryCache;
  selectedItemId?: string;
  sceneViewId?: string;
  onSelect: (item?: Pick<SceneViewItem, "id" | "transform">) => void;
}

export function translateOnMove<P extends ViewerProps>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  WrappedViewer: any
): React.FunctionComponent<P & TranslateOnMoveProps & FetchItemOnTapProps> {
  return function Component({
    undoStack,
    cache,
    selectedItemId,
    sceneViewId,
    viewer,
    onSelect,
    ...props
  }) {
    const [translationOrigin, setTranslationOrigin] = React.useState<
      Point.Point | undefined
    >();
    const [selectedItem, setSelectedItem] = React.useState<
      | Pick<
          SceneViewItem,
          "id" | "materialOverride" | "transform" | "worldTransform"
        >
      | undefined
    >();
    const [dimensions, setDimensions] = React.useState<
      Dimensions.Dimensions | undefined
    >(viewer.current?.getBoundingClientRect());

    // Transform on mouse move
    React.useEffect(() => {
      const handleMouseMove = async (e: MouseEvent): Promise<void> => {
        if (
          selectedItem != null &&
          translationOrigin != null &&
          dimensions != null
        ) {
          const scene = await viewer.current?.scene();
          const camera = scene?.camera();

          if (scene != null && camera != null && selectedItem != null) {
            await undoStack.execute(
              transform(
                viewer,
                cache,
                selectedItem,
                calculateTranslation(
                  camera,
                  translationOrigin,
                  Point.create(e.clientX, e.clientY),
                  dimensions,
                  selectedItem
                )
              )
            );
          }
        } else if (selectedItem != null) {
          setTranslationOrigin({
            x: e.clientX,
            y: e.clientY,
          });
        }
      };

      const effectRef = viewer.current;
      effectRef?.addEventListener("mousemove", handleMouseMove);

      return () => {
        effectRef?.removeEventListener("mousemove", handleMouseMove);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dimensions, selectedItem, translationOrigin]);

    React.useEffect(() => {
      const escListener = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
          setSelectedItem(undefined);
          setTranslationOrigin(undefined);
          onSelect();
        }
      };

      window.addEventListener("keydown", escListener);

      return () => {
        window.removeEventListener("keydown", escListener);
      };
    });

    React.useEffect(() => {
      const fetchItem = async (): Promise<void> => {
        if (sceneViewId != null && selectedItemId != null) {
          const query = await fetchSceneViewItemFullTransform(
            sceneViewId,
            selectedItemId
          );

          if (query.data.sceneViewItem != null) {
            setSelectedItem(query.data.sceneViewItem);
          }
        }
      };

      fetchItem();
    }, [sceneViewId, selectedItemId]);

    return (
      <>
        {selectedItemId != null && selectedItem == null && (
          <>
            <div className="fixed w-full h-full left-0 top-0 opacity-50 bg-black z-popover"></div>
            <div className="fixed w-20 h-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-popover">
              <svg
                className="fill-current animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <path d="M11.27,12.42A5.5,5.5,0,0,1,2.5,8H4L2,5,0,8H1.5A6.5,6.5,0,0,0,8,14.5a6.42,6.42,0,0,0,3.87-1.28.5.5,0,0,0,.1-.7A.5.5,0,0,0,11.27,12.42ZM14.5,8A6.5,6.5,0,0,0,8,1.5,6.42,6.42,0,0,0,4.13,2.78a.5.5,0,0,0-.1.7.5.5,0,0,0,.7.1A5.5,5.5,0,0,1,13.5,8H12l2,3,2-3Z" />
              </svg>
            </div>
          </>
        )}
        <WrappedViewer
          viewer={viewer}
          {...props}
          onSelect={onSelect}
          onDimensionschange={(
            event: VertexViewerCustomEvent<Dimensions.Dimensions>
          ) => {
            if (props.onDimensionschange) {
              props.onDimensionschange(event);
            }

            if (!event.defaultPrevented) {
              setDimensions(event.detail);
            }
          }}
        />
      </>
    );
  };
}
