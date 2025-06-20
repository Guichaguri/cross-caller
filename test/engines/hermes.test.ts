import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackHermes = `Error
    at abc (filename.js:3:18)
    at def (filename.js:7:6)
    at global (filename.js:10:4)`;

const stackReactNativeHermes = `Error
    at baz (address at filename.js.bundle:10:15)
    at bar (address at filename.js.bundle:6:3)
    at foo (address at filename.js.bundle:2:3)`;

test('should parse in Hermes', () => {
  const callsite = parseCallSite(stackHermes, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('18');
});

test('should parse in React Native Hermes', () => {
  const callsite = parseCallSite(stackReactNativeHermes, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('baz');
  expect(callsite!.file).toBe('address at filename.js.bundle');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('15');
});
