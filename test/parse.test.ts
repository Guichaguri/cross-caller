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

test('should skip the error line', () => {
  const callsite = parseCallSite('TypeError\nat abc (file.js:1:1)', 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('file.js');
  expect(callsite!.line).toBe('1');
  expect(callsite!.position).toBe('1');
});

test('should skip the error line with message', () => {
  const callsite = parseCallSite('FetchError: sample\nat abc (file.js:1:1)', 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('file.js');
  expect(callsite!.line).toBe('1');
  expect(callsite!.position).toBe('1');
});

test('should not skip a call site with error function', () => {
  const callsite = parseCallSite('at FetchError (file.js:1:1)', 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('FetchError');
  expect(callsite!.file).toBe('file.js');
  expect(callsite!.line).toBe('1');
  expect(callsite!.position).toBe('1');
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
