import React from "react";

import { Dialog } from "../../components/Dialog";
import { SceneStudio } from "../../lib/scene-studio";

interface Props {
  studioApp: SceneStudio;
  open: boolean;
  onClose: VoidFunction;
}

export function ConfirmSaveDialog({
  studioApp,
  open,
  onClose,
}: Props): JSX.Element {
  const [saveCamera, setSaveCamera] = React.useState(false);

  return (
    <Dialog
      header="Save Scene"
      footer={
        <React.Fragment>
          <button
            className="btn btn-primary"
            disabled={studioApp.state.isSaving}
            onClick={async () => {
              if (saveCamera) {
                const scene = await studioApp.viewerCtx.viewer.current?.scene();
                await studioApp.save(scene?.camera());
              } else {
                await studioApp.save();
              }

              onClose();
            }}
          >
            Save
          </button>
          <button
            className="btn btn-secondary"
            disabled={studioApp.state.isSaving}
            onClick={onClose}
          >
            Cancel
          </button>
        </React.Fragment>
      }
      open={open}
      onClose={onClose}
    >
      <div data-testid="dialog-content">
        You&apos;re about to save changes to the scene, and cannot be undone.
        Are you sure you want to continue?
      </div>
      <div className="flex items-center py-4">
        <input
          className="mr-2 rounded focus:border-blue-500 focus:ring-1 focus:outline-none focus:ring-offset-0 focus:ring-blue-500"
          checked={saveCamera}
          onChange={(e) => setSaveCamera(e.target.checked)}
          type="checkbox"
        />
        Save the camera to the scene
      </div>
    </Dialog>
  );
}
