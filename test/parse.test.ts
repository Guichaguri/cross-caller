import { expect, test } from 'vitest';
import { getCaller, parseCallSite } from '../src';

test('should not parse an invalid stack', () => {
  const callsite = parseCallSite('lorem ipsum\ndolor sit amet', 0);

  expect(callsite).toBeNull();
});

test('should not parse an invalid depth', () => {
  const callsite = parseCallSite('Error', 50);

  expect(callsite).toBeNull();
});

test('should get caller in the current engine', () => {
  function foo() {
    return getCaller();
  }

  const callsite = foo();

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe(foo.name);
  expect(callsite!.file).toContain('parse.test.ts');
  expect(callsite!.line).not.toBe('');
  expect(callsite!.position).not.toBe('');
})
