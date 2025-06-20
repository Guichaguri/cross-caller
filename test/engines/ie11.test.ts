import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackIE11 = `Error
    at baz (filename.js:10:15)
    at bar (filename.js:6:3)
    at foo (filename.js:2:3)
    at filename.js:13:1`;

test('should parse in IE 11 with function name', () => {
  const callsite = parseCallSite(stackIE11, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('baz');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('15');
});

test('should parse in IE 11 without function name', () => {
  const callsite = parseCallSite(stackIE11, 3);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('13');
  expect(callsite!.position).toBe('1');
});
