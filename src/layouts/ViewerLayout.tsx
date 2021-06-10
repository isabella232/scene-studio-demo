import React from "react";

import { Header } from "../components/Header";
import { SceneStudio } from "../lib/scene-studio";

interface Props {
  mutationsEnabled: boolean;
  sidebar: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  studioApp: SceneStudio;
}

export function ViewerLayout({
  mutationsEnabled,
  sidebar,
  children,
  studioApp: { dispatch },
}: Props): JSX.Element {
  return (
    <main className="h-screen w-screen">
      <div className="h-full w-full grid grid-cols-sidebar-16 grid-rows-header-6">
        <div className="col-span-full">
          <Header>
            <div className="ml-4 mr-auto">
              {mutationsEnabled && (
                <button
                  className="btn btn-primary text-sm"
                  onClick={() =>
                    dispatch({ type: "set-confirm-save-dialog", isOpen: true })
                  }
                >
                  Save
                </button>
              )}
            </div>
          </Header>
        </div>
        <div className="row-start-2 row-span-full col-span-1">{sidebar}</div>
        <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
          {children}
        </div>
      </div>
    </main>
  );
}
