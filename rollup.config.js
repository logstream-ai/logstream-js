import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: `src/index.ts`,
    plugins: [typescript()],
    output: [
      {
        file: "dist/index.js",
        format: "umd",
        name: "Logstream",
        exports: "named",
      },
    ],
  },
];
