import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackNashorn = `Error
\tat abc (filename.js:3)
\tat def (filename.js:7)
\tat <program> (filename.js:10)`;

test('should parse in Nashorn', () => {
  const callsite = parseCallSite(stackNashorn, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('');
});
