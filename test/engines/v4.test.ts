import { expect, test } from 'vitest';
import { parseCallSite } from '../../src';

const stackV4 = `abc@qrc:/qt/qml/testqt/Main.qml:11
def@qrc:/qt/qml/testqt/Main.qml:15
expression for onWidthChanged@qrc:/qt/qml/testqt/Main.qml:18`;

test('should parse in V4 with function name', () => {
  const callsite = parseCallSite(stackV4, 0);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('abc');
  expect(callsite!.file).toBe('qrc:/qt/qml/testqt/Main.qml');
  expect(callsite!.line).toBe('11');
  expect(callsite!.position).toBe('');
});

test('should parse in V4 without function name', () => {
  const callsite = parseCallSite(stackV4, 2);

  expect(callsite).not.toBeNull();
  expect(callsite!.function).toBe('expression for onWidthChanged');
  expect(callsite!.file).toBe('qrc:/qt/qml/testqt/Main.qml');
  expect(callsite!.line).toBe('18');
  expect(callsite!.position).toBe('');
});
