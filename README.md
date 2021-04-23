# Getting Started with

This project configured for personal usage only.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Runs the typescript complier just for type checking then runs eslint to check any eslint error exists in files with `.ts(x)` formats. It uses `eslintrc.js`and`.eslintignore` file that you have in root folder (same directory with package.json).

### `npm run format`

Runs eslint to check any eslint error exists in files with `.ts(x)` formats. It uses `eslintrc.js` and `.eslintignore` file that you have in root folder (same directory with package.json).

### `npm run prettier-format`

Runs prettier for `.ts(x)` formats only and fix the prettier issues. It uses `.prettierrc` file that you have in root folder (same directory with package.json).

### `npm run test`

Runs test files inside the `__test__` folder with default options that configured for debugging purpose.
