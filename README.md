# Spinal Cord Toolbox QC Report Generator

This package bundles the UI for [SCT QC reports](https://github.com/spinalcordtoolbox/spinalcordtoolbox/tree/master/spinalcordtoolbox/reports).

- [Generating reports](https://spinalcordtoolbox.com/stable/overview/concepts/inspecting-results-qc-fsleyes.html)
- [Design document](https://github.com/spinalcordtoolbox/spinalcordtoolbox/wiki/Programming:-QC-Reports)

## Development

We use [Vite](https://github.com/spinalcordtoolbox/spinalcordtoolbox/tree/master/spinalcordtoolbox/reports) for building,
[React](https://react.dev) to manage the DOM, and [tailwind](https://tailwindcss.com) for styling.
[Typescript](https://www.typescriptlang.org) keeps our runtime errors to a minimum.

### Installation

0. Install [npm](https://www.npmjs.com) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
1. Clone the repository
2. In the repo, run `yarn`
3. Run a development server with hot module replacement with `yarn dev`.

### Building for production

1. `yarn build`
2. Open the bundled index.html in your browser `:)`

### File bundling

Since a main use case for QC reports is offline generation and viewing, and since modern browsers
don't trust filesystem resources without modifying the browser, we need a way to package
the built JS and CSS that doesn't trigger CORS errors. The original way this was done seems to be by
appending the `<script>` tags to the body with relative import paths like `_assets/main.js`.

Vite by default packages distributed JS and CSS the standard way, as minified modules. Lucky for us,
there's already a [great plugin](https://github.com/richardtallent/vite-plugin-singlefile) that
stuffs all the generated code into index.html. This, obviously, makes for a messy HTML file, but it
has the advantage of living in a single file that we can distribute.

Running `yarn build`, you'll see something like

```
rendering chunks (1)...

Inlining: index-D6DutMGV.js
Inlining: style-CLOgedyW.css
```

as the plugin runs.

### Injecting datasets

In order to add data to the report, simply overwrite `datasets.js`, which is a simple JS file that
populates `window.SCT_QC_DATASETS` with a JSON array of datasets. You can find a reference version in
`public/datasets.js`

```

```
