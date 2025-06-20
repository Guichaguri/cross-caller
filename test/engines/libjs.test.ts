import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackLibJS = `Error
    at Error
    at abc (filename.js:3:9)
    at def (filename.js:7:6)
    at filename.js:10:4
`;

test('should parse in LibJS with function name', () => {
  const callsite = parseCallSite(stackLibJS, 1);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('9');
});

test('should parse in LibJS without function name', () => {
  const callsite = parseCallSite(stackLibJS, 3);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('4');
});
