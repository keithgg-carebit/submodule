import terser from "@rollup/plugin-terser"

const config = {
    input: "src/plugin/index.js",
    output: [
        { file: "dist/bundle.min.cjs", format: "cjs" }
    ],
    external: [
        "path",
        "jsdoc/env"
    ],
    plugins: [
        terser({ maxWorkers: 6 })
    ]
}

export default config