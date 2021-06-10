import classNames from "classnames";
import React from "react";

import { Icon } from "../../components/Icon";
import { Sidebar } from "../../components/Sidebar";
import { PrimaryPanel } from "../../lib/scene-studio";

interface Props {
  activePanel?: PrimaryPanel;
  onPanelSelected: (contentType?: PrimaryPanel) => void;
}

export function PrimarySidebar({
  activePanel,
  onPanelSelected,
}: Props): JSX.Element {
  const sidebarIcon = "w-8 h-8 mb-2 p-1 cursor-pointer hover:bg-neutral-200";

  return (
    <Sidebar>
      <div
        className={classNames(sidebarIcon, {
          ["text-blue-700"]: activePanel === "scene-objects",
        })}
        onClick={() =>
          activePanel === "scene-objects"
            ? onPanelSelected(undefined)
            : onPanelSelected("scene-objects")
        }
      >
        <Icon icon="scene-items" />
      </div>
    </Sidebar>
  );
}
