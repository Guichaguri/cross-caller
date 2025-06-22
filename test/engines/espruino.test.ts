import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackEspruino = `    at asd (:1:23)
console.log(new Error().stack);
                      ^
    at def (:1:5)
asd();
    ^
    at REPL (:1:5)
def();
    ^`;

test('should parse in Espruino with function name', () => {
  const callsite = parseCallSite(stackEspruino, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('asd');
  expect(callsite!.file).toBe('');
  expect(callsite!.line).toBe('1');
  expect(callsite!.position).toBe('23');
});

test('should skip formatting in Espruino', () => {
  const callsite = parseCallSite(stackEspruino, 2);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('REPL');
  expect(callsite!.file).toBe('');
  expect(callsite!.line).toBe('1');
  expect(callsite!.position).toBe('5');
});
