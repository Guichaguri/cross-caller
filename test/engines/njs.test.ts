import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackNJS = `Error
    at abc (filename.js:3)
    at def (filename.js:9)
    at main (filename.js:12)
`;

test('should parse in NJS', () => {
  const callsite = parseCallSite(stackNJS, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('');
});
