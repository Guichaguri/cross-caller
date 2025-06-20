import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackJavaScriptCore = `baz@filename.js:10:15
bar@filename.js:6:3
foo@filename.js:2:3
global code@filename.js:13:1`;

const stackJavaScriptCoreNoFileInfo = `baz@
bar@
foo@
global code@`;

test('should parse in JavaScriptCore with function name', () => {
  const callsite = parseCallSite(stackJavaScriptCore, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('baz');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('15');
});

test('should parse in JavaScriptCore without function name', () => {
  const callsite = parseCallSite(stackJavaScriptCore, 3);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('global code');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('13');
  expect(callsite!.position).toBe('1');
});

test('should not parse in JavaScriptCore without file info', () => {
  const callsite = parseCallSite(stackJavaScriptCoreNoFileInfo, 0);

  expect(callsite).toBeNull();
});
