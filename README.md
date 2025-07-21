# report-ui

This repository contains the necessary files to generate the `index.html` file used for 
[SCT QC reports](https://github.com/spinalcordtoolbox/spinalcordtoolbox/tree/master/spinalcordtoolbox/reports).

## Using this repo

### Files and folders

This repo contains several subfolders:

- `src/`: The source files for this project. If you want to add a feature or fix a bug, you should
  take a look at the files in this directory.
- `sample/default/`: This is a sample QC report dataset used for testing. 
- `dist/`: DO NOT EDIT. This folder contains the _generated output files_ that get put into the
  release of `report-ui`. These files come from the files in `src/`, so you should edit those instead.

### Testing your changes

0. Install [npm](https://www.npmjs.com) and [yarn](https://yarnpkg.com/getting-started/install)
1. In the repo, run `yarn` to initialize the repo, install packages, etc.
2. Next, run `yarn dev` to start a development server with hot module replacement (i.e. an "editable
   install" in Python terms). It'll print a link you can click or copy into your browser.

#### Testing using existing an existing QC report 

Sometimes you need to run the development version against a report generated in SCT. To do so, use
the utility script `import_report.sh path/to/qc/root`, where `path/to/qc/root` is the directory
containing index.html, js, py, etc. This will copy the report into the `sample/` directory,
with some modifications to make it work with the dev server.

You can change which report your targeting by setting the `VITE_SAMPLE_DATASETS` environment
variable. You can add it to `.env.development.local`:

```
VITE_SAMPLE_DATASETS=0f51622a-6059-4cfe-bedb-0a766e0c705e
```

Then run `yarn dev` as usual.

### Building for production

1. Run the command `yarn build`.
2. Open the bundled index.html in your browser `:)` - it'll live in `dist/`

Then, you can open the `index.html` file like normal to test your changes.

----

## Technical details (for developers)

This repo uses use [Vite](https://vite.dev/) for building,
[React](https://react.dev) to manage the DOM, and [tailwind](https://tailwindcss.com) for styling.
[Typescript](https://www.typescriptlang.org) keeps our runtime errors to a minimum.

### Why do we bundle everything into one `index.html` file?

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

### How do datasets get injected after the `index.html` is build?

This package is meant to be used in tandem with [SCT](https://github.com/spinalcordtoolbox/spinalcordtoolbox)'s
QC report generator, which knows how to inject datasets into the `js/datasets.js` file.

