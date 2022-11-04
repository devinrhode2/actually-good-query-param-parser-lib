# type safe query param parsing URLSearchParams typescript

This is a TINY wrapper around URLSearchParams.

It's a query string parsing library. That is type safe.

It's reads off of `window.location`.

# Usage
```ts
import { getParam } from 'actually-good-query-param-parser-lib';

const param = getParam('paramName');
// Returns `string | undefined`
```


const params = new URLSearchParams(window.location.search);
const paramValues = params.getAll('foo')
if (paramValues.length > 0) {
  throw new Error('Multiple foo params found:' + paramValues.join(','));
  // you can catch the error and console.error it if you want.
  // but this lib/strictest import won't be doing that.
  //
  // A separate import could do that.
  //   Throw in development, console.error in prod.
  //   You probably need to pass in an `isProd` variable to opt into that behavior.
  // Or more simply:
  //   
  //   { throwIf: !isProd }
  //
  // If you do go in that direction,
  // you'll probably want to default to the first one,
  // because that's what params.get('foo') does.
  //  And:
  //    If there is no `foo` param, convert everything to lower case and try again(??)
  // An additional check could be added to development mode only:
  //  If there is no `foo` param, convert all param keys to lower case, try again, and throw error that their key casing is wrong.
  //  If there is no `foo` param, params.forEach, call .toLowerCase on all keys, and ????
  // But what about standard case where param is just missing?
}
return paramValues[0]





## Contributing

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

#### Setup Files

This is the folder structure we set up for you:

```txt
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean

// inside your code...
if (__DEV__) {
  console.log('foo')
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).
