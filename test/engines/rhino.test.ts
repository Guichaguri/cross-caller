import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackRhino = `\tat filename.js:3 (abc)
\tat filename.js:7 (def)
\tat filename.js:10`;

const stackRhinoV8 = `
    at abc (filename.js:3:0)
    at def (filename.js:7:0)
    at filename.js:10:0`;

const stackRhinoMozilla = `abc()@filename.js:3
def()@filename.js:7
@filename.js:10`;

test('should not parse in Rhino', () => {
  const callsite = parseCallSite(stackRhino, 0);

  expect(callsite).toBeNull();
});

test('should not parse in Rhino without function name', () => {
  const callsite = parseCallSite(stackRhino, 2);

  expect(callsite).toBeNull();
});

test('should parse in Rhino V8 style', () => {
  const callsite = parseCallSite(stackRhinoV8, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('0');
});

test('should parse in Rhino V8 style without function name', () => {
  const callsite = parseCallSite(stackRhinoV8, 2);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('0');
});


test('should not parse in Rhino Mozilla style', () => {
  const callsite = parseCallSite(stackRhinoMozilla, 0);

  expect(callsite).toBeNull();
});

test('should not parse in Rhino Mozilla style without function name', () => {
  const callsite = parseCallSite(stackRhinoMozilla, 2);

  expect(callsite).toBeNull();
});
