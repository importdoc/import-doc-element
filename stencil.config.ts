import { Config } from "@stencil/core";
import replace from "@rollup/plugin-replace";

export const config: Config = {
  namespace: "import-doc",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
    },
    {
      type: "docs-readme",
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [
    // @ts-ignore
    replace({ API_URL: process.env.API_URL || "https://api.importdoc.com" }),
  ],
};
