import * as React from "react";

import { Dialog } from "../../components/Dialog";
import { StreamCredentials } from "../../lib/env";

interface Props {
  credentials: StreamCredentials;
  open: boolean;
  onClose: VoidFunction;
  onConfirm: (credentials: StreamCredentials) => void;
}

export function OpenScene({
  credentials,
  open,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const [inputCreds, setInputCreds] =
    React.useState<StreamCredentials>(credentials);
  const emptyClientId = inputCreds.clientId === "";

  return (
    <Dialog
      header="Open Scene"
      footer={
        <React.Fragment>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (inputCreds.clientId && inputCreds.streamKey) {
                onConfirm(inputCreds);
              }
            }}
          >
            Open Scene
          </button>
          <button className="btn btn-secondary" onClick={() => onClose()}>
            Cancel
          </button>
        </React.Fragment>
      }
      open={open}
      onClose={() => onClose()}
    >
      <div data-testid="dialog-content">
        {
          <>
            Enter the Client ID and stream key to view and edit your scene.
            <div className="py-2">
              <input
                autoFocus={emptyClientId}
                className="txt-input"
                placeholder="Client ID"
                type="text"
                value={inputCreds.clientId}
                onChange={(e) =>
                  setInputCreds({
                    ...inputCreds,
                    clientId: e.target.value,
                  })
                }
              />
            </div>
            <div className="py-2">
              <input
                autoFocus={!emptyClientId}
                className="txt-input"
                placeholder="Stream Key"
                type="text"
                value={inputCreds.streamKey}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setInputCreds({
                    ...inputCreds,
                    streamKey: e.target.value,
                  })
                }
              />
            </div>
          </>
        }
      </div>
    </Dialog>
  );
}

export function encodeCreds(cs: StreamCredentials): string {
  return `/?clientId=${encodeURIComponent(
    cs.clientId
  )}&streamKey=${encodeURIComponent(cs.streamKey)}`;
}
