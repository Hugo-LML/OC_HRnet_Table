import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  target: "es2020",
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom"]
});