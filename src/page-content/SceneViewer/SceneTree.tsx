import { Row } from "@vertexvis/viewer/dist/types/components/scene-tree/lib/row";
import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import { VertexSceneTree } from "@vertexvis/viewer-react";
import React from "react";

import * as Icon from "../../components/Icon";
import { SceneViewItem } from "../../generated/graphql/react";
import { cache } from "../../lib/graphql";
import { deselectItem, selectItem, hide, show } from "../../lib/undo-commands";
import { SceneStudio } from "../../lib/scene-studio";

interface Props {
  readonly configEnv: Environment;
  readonly studioApp: SceneStudio;
  readonly viewerId: string;
}

export function SceneTree({
  configEnv,
  studioApp,
  viewerId,
}: Props): JSX.Element {
  const ref = React.useRef<HTMLVertexSceneTreeElement>(null);
  const {
    viewerCtx: { viewer },
    state,
    dispatch,
    undoStack,
  } = studioApp;

  React.useEffect(() => {
    const effectRef = ref.current;
    effectRef?.addEventListener("click", clickRow);
    return () => effectRef?.removeEventListener("click", clickRow);
  });

  const clickRow = async (event: MouseEvent | PointerEvent): Promise<void> => {
    const result = await ref?.current?.getRowForEvent(event);

    if (result != null && result.node.selected) {
      ref.current?.deselectItem(result);
    } else {
      ref.current?.selectItem(result);
    }
  };

  const handleSelectItem = (item?: Pick<SceneViewItem, "id">): void => {
    if (item != null) {
      undoStack.execute(selectItem(viewer, cache, state, dispatch, item));

      if (ref.current != null) {
        ref.current.scrollToItem(item.id);
      }
    } else {
      const command = deselectItem(viewer, cache, state, dispatch);
      if (command != null) {
        undoStack.execute(command);
      }
    }
  };

  const handleVisibilityChange = (row: Row): void => {
    if (row?.node == null) return;

    const id = row.node.id?.hex;
    if (id == null) return;

    if (row.node.visible) {
      undoStack.execute(
        hide(viewer, cache, {
          __typename: "SceneViewItem",
          id: id ?? "",
        })
      );
    } else {
      undoStack.execute(show(viewer, id));
    }
  };

  return (
    <VertexSceneTree
      configEnv={configEnv}
      ref={ref}
      rowData={(row: Row) => {
        if (row?.node == null) return {};

        return {
          toggleVisibility: (event: PointerEvent | MouseEvent) => {
            event.stopPropagation();
            handleVisibilityChange(row);
          },
          visible: row.node.visible,
          icon: Icon.getPath(
            row.node.visible ? "visibility-shown" : "visibility-hidden"
          ),
        };
      }}
      selectionDisabled={true}
      viewerSelector={`#${viewerId}`}
    >
      <Template>
        {`
          <div style="height: 16px; width: 16px; fill: #757575" className="fill-neutral-500" onClick="{{row.data.toggleVisibility}}">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
          >
            <path d="{{row.data.icon}}" />
          </svg>
          </div>
        `}
      </Template>
    </VertexSceneTree>
  );
}

function Template({ children }: { readonly children: string }): JSX.Element {
  return <template dangerouslySetInnerHTML={{ __html: children }} />;
}
