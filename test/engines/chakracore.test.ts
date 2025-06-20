import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackChakraCore = `Error
    at abc (filename.js:3:9)
    at def (filename.js:7:3)
    at filename.js:10:1`;

test('should parse in ChakraCore with function name', () => {
  const callsite = parseCallSite(stackChakraCore, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('9');
});

test('should parse in ChakraCore without function name', () => {
  const callsite = parseCallSite(stackChakraCore, 2);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('1');
});
