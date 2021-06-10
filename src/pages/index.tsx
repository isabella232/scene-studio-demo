import { head } from "@vertexvis/vertex-api-client";
import { useRouter } from "next/router";
import React from "react";

import { DefaultCredentials, StreamCredentials } from "../lib/env";
import { encodeCreds, OpenScene } from "../page-content/SceneViewer/OpenScene";

function HomePage(): JSX.Element {
  const router = useRouter();
  const [credentials, setCredentials] = React.useState<
    StreamCredentials | undefined
  >();
  const [dialogOpen, setDialogOpen] = React.useState(true);

  React.useEffect(() => {
    if (!router.isReady) return;

    setCredentials({
      clientId: head(router.query.clientId) || DefaultCredentials.clientId,
      streamKey: head(router.query.streamKey) || DefaultCredentials.streamKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  React.useEffect(() => {
    if (credentials) router.push(encodeCreds(credentials));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  return router.isReady && credentials ? (
    <main>
      <button
        className="btn btn-primary absolute bottom-4 right-4 z-popover text-sm"
        onClick={() => setDialogOpen(true)}
      >
        Open Scene
      </button>
      {dialogOpen && credentials && (
        <OpenScene
          credentials={credentials}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(creds) => {
            setCredentials(creds);
            router.push(
              `/scene-viewer?clientId=${encodeURIComponent(
                creds.clientId
              )}&streamKey=${encodeURIComponent(creds.streamKey)}`
            );
          }}
        />
      )}
    </main>
  ) : (
    <></>
  );
}

export default HomePage;
