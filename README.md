# cross-caller

[![NPM](https://img.shields.io/npm/v/cross-caller)](https://www.npmjs.com/package/cross-caller)

Allows a function to get its caller function name, file, line number and position in all JavaScript engines.

This library is useful for debugging, logging, and tracing function calls.

## Installation

```sh
npm install cross-caller
```

## Usage

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
  - V8 (Node.js, Deno, Chrome, Edge, Opera and all other Chromium-based browsers)
  - JavaScriptCore (Safari, Bun and all browsers in iOS)
  - SpiderMonkey (Firefox)
  - Hermes (React Native and Expo)
  - ChakraCore (old Edge and old React Native for Windows)
  - LibJS (Ladybird)
  - V4 (Qt)
  - QuickJS
  - QuickJS-NG
  - Duktape
  - XS
  - Espruino
  - GraalJS
  - Nashorn
  - Jint
  - Rhino (see caveats below)
  - Internet Explorer 10+ (see caveats below)
  - njs (see caveats below)
  - Jurassic (see caveats below)
  - engine262
  - MuJS
- Allows getting the caller function name, JS file, line number and position
- Allows getting the caller up to the 8th depth in any of these JS engines
- Small, only ~0.3 KB minified and gzipped

## Examples

```js
import { getCaller } from 'cross-caller';

function foo() {
  // Gets the immediate caller (which would be bar)
  console.log(getCaller().function === 'bar');

  // Gets the caller of the caller (which would be baz)
  console.log(getCaller(1).function === 'baz');

  // Gets the caller of the caller of the caller (which would be the global scope)
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

```js
function log(message) {
  const caller = getCaller();
  const filename = caller.file.split('/').pop(); // Get only the file name from the full path
  
  // Logs something like: [sample.js:10] Hello World
  console.log(`[${filename}:${caller.line}] ${message}`);
}
```

## Caveats

### Global Scope, Eval and REPL

Each JS environment has a different way of naming the global scope, eval and REPL.
That means that the call site details may vary in each of them.

For instance, in Node.js the global scope is reported as `Object.<anonymous>`, an eval is reported as `eval at X, Y` and a REPL is reported as `REPL0`.
In Chrome, the DevTools Console is reported as `<anonymous>`.
In Firefox, the DevTools Console is reported as `debugger eval code` and an eval is reported as `Y line X > eval`.

### IE 10, IE 11, njs and Jurassic

The stack info is not available in these JS engines until you throw the error.
If you really need to support these engines, you can use the workaround below that throws an error to get the stack trace.

However, while this approach does work in all engines, it is not recommended as it can lead to performance issues.

```ts
import { parseCallSite } from 'cross-caller';

// Works on IE 10, IE 11, njs and Jurassic
// as well as all other supported JS engines
function getCallerCompat(depth) {
  try {
    throw new Error();
  } catch (err) {
    return parseCallSite(err.stack, (depth || 0) + 2);
  }
}
```

### Rhino

Rhino supports three types of stack trace formats: Rhino's own format, V8 and Mozilla formats.
This library does not support capturing filenames in Rhino's own format, but does on both the V8 and the Mozilla formats.

You can change to either format by setting the system property `rhino.stack.style` to `V8` or `MOZILLA`, or call `RhinoException.setStackStyle(StackStyle.V8)` programmatically.

### Other

Other JS engines are not supported by this library either because they don't emit stack traces (such as Boa, Kiesel and JerryScript) or they are very old and not widely used anymore (such as IE 9 and older).
