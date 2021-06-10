import { Environment } from "@vertexvis/viewer/dist/types/config/environment";

import { getBool, getString } from "./envVars";

interface Configuration {
  mutationsEnabled: boolean;
  vertexEnv: Environment;
  clientId: string;
  clientSecret: string;
  basePath: string;
  sceneTreeHost: string;
}

const vertexEnv = getString("VERTEX_ENV", "platprod");
const mutationsEnabled = getBool("MUTATIONS_ENABLED", true);

export const config: Configuration = {
  mutationsEnabled,
  vertexEnv: vertexEnv as Environment,
  clientId: getString("VERTEX_CLIENT_ID", ""),
  clientSecret: getString("VERTEX_CLIENT_SECRET", ""),
  basePath:
    vertexEnv === "platprod"
      ? "https://platform.vertexvis.com"
      : `https://platform.${vertexEnv}.vertexvis.io`,
  sceneTreeHost:
    vertexEnv === "platprod"
      ? "https://scene-trees.vertexvis.com"
      : `https://scene-trees.${vertexEnv}.vertexvis.io`,
};
