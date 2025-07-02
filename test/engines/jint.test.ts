import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackJint = `   at abc (filename.js:3:15)
   at def (filename.js:7:3)
   at filename.js:10:1`;

test('should parse in Jint', () => {
  const callsite = parseCallSite(stackJint, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('15');
});

test('should parse in Jint without function name', () => {
  const callsite = parseCallSite(stackJint, 2);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('');
});
