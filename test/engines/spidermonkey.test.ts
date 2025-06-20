import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackSpiderMonkey = `baz@filename.js:10:15
bar@filename.js:6:3
foo@filename.js:2:3
@filename.js:13:1`;

test('should parse in SpiderMonkey with function name', () => {
  const callsite = parseCallSite(stackSpiderMonkey, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('baz');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('15');
});

test('should parse in SpiderMonkey without function name', () => {
  const callsite = parseCallSite(stackSpiderMonkey, 3);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('13');
  expect(callsite!.position).toBe('1');
});
