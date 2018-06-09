import { Options } from "poi";

const options: Options = {
  entry: "components/index.ts",
  publicPath: "/onisun/",
  plugins: [
    require("@poi/plugin-typescript")()
  ]
};

export default options;
