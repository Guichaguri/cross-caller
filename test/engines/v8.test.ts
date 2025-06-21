import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackV8 = `Error
    at baz (filename.js:10:15)
    at bar (filename.js:6:3)
    at foo (filename.js:2:3)
    at filename.js:13:1`;

const stackV8WithText = `Error: An error occurred
    at baz (filename.js:10:15)
    at bar (filename.js:6:3)
    at foo (filename.js:2:3)
    at filename.js:13:1`;

const stackV8EvalRepl = `Error
    at asd (eval at <anonymous> (REPL1:1:1), <anonymous>:1:30)
    at eval (eval at <anonymous> (REPL1:1:1), <anonymous>:1:51)
    at REPL1:1:1
    at ContextifyScript.runInThisContext (node:vm:121:12)
    at REPLServer.defaultEval (node:repl:599:22)
    at bound (node:domain:432:15)
    at REPLServer.runBound [as eval] (node:domain:443:12)
    at REPLServer.onLine (node:repl:929:10)
    at REPLServer.emit (node:events:530:35)
    at REPLServer.emit (node:domain:488:12)`;

test('should parse in V8 with function name', () => {
  const callsite = parseCallSite(stackV8, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('baz');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('15');
});

test('should parse in V8 without function name', () => {
  const callsite = parseCallSite(stackV8, 3);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('13');
  expect(callsite!.position).toBe('1');
});

test('should parse in V8 with error message', () => {
  const callsite = parseCallSite(stackV8WithText, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('baz');
  expect(callsite!.file).toBe('filename.js');
  expect(callsite!.line).toBe('10');
  expect(callsite!.position).toBe('15');
});

test('should parse in V8 with eval', () => {
  const callsite = parseCallSite(stackV8EvalRepl, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('asd');
  expect(callsite!.file).toBe('eval at <anonymous> (REPL1:1:1), <anonymous>');
  expect(callsite!.line).toBe('1');
  expect(callsite!.position).toBe('30');
});
