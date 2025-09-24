import { defineConfig } from "rollup";

export default defineConfig({
    input: "src/main.js",
    output: {
        file: "../.output/index.js",
        format: "module",
        dir: "../.output",
    },
    plugins: [],
});
