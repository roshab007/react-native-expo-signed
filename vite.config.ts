import builtinModules from "builtin-modules";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ExpoSignedPlugin",
      formats: ["cjs"],
      fileName: () => `index.js`,
    },
    outDir: "build",
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      external: [
        // Automatically exclude ALL native Node modules AND expo-config deps
        ...builtinModules, // node:fs, fs, path, etc
        ...builtinModules.map((m) => `node:${m}`),

        // Auto exclude dependencies from package.json for plugin safety
        /^@expo\//,
        /^expo$/,
        /^xcode/,
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    dts({
      outDir: "build",
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
