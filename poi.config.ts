import { Options } from "poi";

const options: Options = {
  entry: "src/index.ts",
  homepage: "/onisun/",
  plugins: [
    require("@poi/plugin-typescript")()
  ]
};

export default options;
