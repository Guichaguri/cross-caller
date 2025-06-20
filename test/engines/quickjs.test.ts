import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackQuickJS = `    at abc (filename.js:3)
    at def (filename.js:7)
    at <eval> (filename.js:10)`;

const stackQuickJSNG = `    at abc (filename.js:3:13)
    at def (filename.js:7:3)
    at <anonymous> (filename.js:10:1)`;

test('should parse in QuickJS', () => {
  const callsite = parseCallSite(stackQuickJS, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('');
});

test('should parse in QuickJS-NG', () => {
  const callsite = parseCallSite(stackQuickJSNG, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('13');
});
