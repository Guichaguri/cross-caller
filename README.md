# cross-caller

[![NPM](https://img.shields.io/npm/v/cross-caller)](https://www.npmjs.com/package/cross-caller)

Gets the caller function name, path, line number and position in all browsers and server environments. 

```sh
npm install cross-caller
```

```js
// sample.js
import { getCaller } from 'cross-caller';

function main() {
  doSomething();
}

function doSomething() {
  const caller = getCaller(); // Gets the immediate caller
  
  console.log(caller.function); // main
  console.log(caller.file);     // path/to/sample.js
  console.log(caller.line);     // 5
  console.log(caller.position); // 2
}

main();
```

## Features

- Supports almost all JavaScript engines (browsers, servers, mobile and embedded)
  - V8 (Node.js, Deno and all Chromium-based browsers)
  - JavaScriptCore (Safari, Bun and all iOS browsers)
  - SpiderMonkey (Firefox)
  - Hermes (React Native and Expo)
  - ChakraCore (old Edge and old React Native for Windows)
  - V4 (Qt)
  - QuickJS
  - QuickJS-NG
  - Duktape
  - XS
  - GraalJS
  - Nashorn
  - Rhino (requires a workaround, see below)
  - Internet Explorer 11 (requires a workaround, see below)
  - LibJS (requires a workaround, see below)
- Allows getting the caller function name, JS file, line number and position
- Allows getting the caller up to the 8th depth in any of these JS engines
- Small, only 0.3 KB minified and gzipped

## Samples

```js
import { getCaller } from 'cross-caller';

function foo() {
  // Gets the immediate caller (bar)
  console.log(getCaller().function === 'bar');

  // Gets the caller of the caller (baz)
  console.log(getCaller(1).function === 'baz');

  // Gets the caller of the caller of the caller (global scope)
  console.log(getCaller(2));
}

function bar() {
  foo();
}

function baz() {
  bar();
}

baz();
```

```js
function main() {
  // When there is no caller at this depth, returns null
  console.log(getCaller(2) === null);
}

main();
```

## Caveats

### Global Scope, Eval and REPL

Each JS environment has a different way of handling the global scope, eval and REPL.
That means that the call site details may vary in each of them.

For instance, in Node.js the global scope is reported as `Object.<anonymous>`, an eval file is reported as `eval at X, Y` and a REPL file is reported as `REPL0`.

### IE 10 and IE 11

The stack info is not available in IE until you throw the error.
If you really need IE support, you can use the workaround below that throws an error to get the stack trace.

However, while this approach does work in all browsers, it is not recommended as it can lead to performance issues.

```ts
import { parseCallSite } from 'cross-caller';

function getCallerIE(depth) {
  try {
    throw new Error();
  } catch (err) {
    return parseCallSite(err.stack, (depth || 0) + 1);
  }
}
```

### Rhino

Rhino supports three types of stack trace formats: Rhino's own format, V8 and Mozilla formats.
This library supports both the V8 and the Mozilla formats.

You'll need to change to either format by setting the system property `rhino.stack.style` to `V8` or `MOZILLA`, or call `RhinoException.setStackStyle(StackStyle.V8)` programmatically.

### LibJS

LibJS includes an extra line in the stack trace informing the error type, you'll have to skip that one manually by increasing the depth by one.

```ts
console.log(getCaller(1)); // Gets the immediate caller
console.log(getCaller(2)); // Gets the caller or the caller
```

### Other

Other JS engines are not supported by this library either because they don't emit stack traces (such as Boa and Kiesel) or they are very old and not widely used anymore (such as IE 9 and older).

## Resources

- [jsvu](https://github.com/GoogleChromeLabs/jsvu): a really good tool that installs and runs many JavaScript engines.
- [Error.prototype.stack](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack): the property that returns the stack trace, used by this library to determine the caller.

