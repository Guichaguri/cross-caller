import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackGraalJS = `Error
    at abc (filename.js:3:9)
    at def (filename.js:7:3)
    at filename.js:10:1`;

const stackGraalJSShell = `Error
    at abc (<shell>:3:1:30)
    at <shell>:4:1:1`;

test('should parse in GraalJS', () => {
  const callsite = parseCallSite(stackGraalJS, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('3');
  expect(callsite!.position).toBe('9');
});

test('should parse in GraalJS Shell', () => {
  const callsite = parseCallSite(stackGraalJSShell, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('<shell>:3');
  expect(callsite!.line).toBe('1');
  expect(callsite!.position).toBe('30');
});
