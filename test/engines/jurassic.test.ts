import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackJurassic = `    at abc (filename.js:3)
    at def (filename.js:7)
    at filename.js:10`;

test('should parse in Jurassic', () => {
  const callsite = parseCallSite(stackJurassic, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('');
});

test('should parse in Jurassic without function name', () => {
  const callsite = parseCallSite(stackJurassic, 2);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('');
});
