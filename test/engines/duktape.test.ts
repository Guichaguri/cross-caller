import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackDuktape = `Error
    at abc (input:6)
    at def (input:10)
    at eval (input:13) directeval preventsyield
    at eval () native strict directeval preventsyield
    at [anon] (eval:1)
    at eval (eval:1) preventsyield`;

test('should parse in Duktape with function name', () => {
  const callsite = parseCallSite(stackDuktape, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('input');
  expect(callsite!.line).toBe('6');
  expect(callsite!.position).toBe('');
});

test('should parse in Duktape eval with flags', () => {
  const callsite = parseCallSite(stackDuktape, 2);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('eval');
  expect(callsite!.file).toBe('input');
  expect(callsite!.line).toBe('13');
  expect(callsite!.position).toBe('');
});


test('should not parse in Duktape eval without file info', () => {
  const callsite = parseCallSite(stackDuktape, 3);

  expect(callsite).toBeNull();
});

