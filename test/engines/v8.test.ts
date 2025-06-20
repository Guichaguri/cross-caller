import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackV8 = `Error
    at baz (filename.js:10:15)
    at bar (filename.js:6:3)
    at foo (filename.js:2:3)
    at filename.js:13:1`;

const stackV8WithText = `Error: An error occurred
    at baz (filename.js:10:15)
    at bar (filename.js:6:3)
    at foo (filename.js:2:3)
    at filename.js:13:1`;

test('should parse in V8 with function name', () => {
  const callsite = parseCallSite(stackV8, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('baz');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('15');
});

test('should parse in V8 without function name', () => {
  const callsite = parseCallSite(stackV8, 3);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('13');
  expect(callsite!.position).toBe('1');
});

test('should parse in V8 with error message', () => {
  const callsite = parseCallSite(stackV8WithText, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('baz');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('15');
});
