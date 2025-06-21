export interface CallSite {
  /** The caller's function name */
  function: string;

  /** The caller's file uri */
  file: string;

  /** The caller's line number */
  line: string;

  /** The caller's position in the line (column number) */
  position: string;
}

// V8, CharkaCore, GraalJS, Hermes, QuickJS-NG, LibJS, Rhino-V8 - with function names
// "at {function} ({file}:{line}:{position})"
const stackRegex1 = /at\s+(.*?)\s+\((.*):(\d*):(\d*)\)/i;

// V8, CharkaCore, GraalJS, LibJS, Rhino - without function names
// "at {file}:{line}:{position}"
const stackRegex2 = /at\s+()(.*):(\d*):(\d*)/i;

// JavaScriptCore, SpiderMonkey, Rhino-Mozilla and V4 - both with and without function names and positions
// "{function}@{file}:{line}:{position}"
const stackRegex3 = /(.*?)(?:\(\))?@(?:(.*?):(\d+)(?::(\d+))?)?/i;

// QuickJS, XS, Duktape and Nashorn - without position
// "at {function} ({file}:{line})"
const stackRegex4 = /at\s*(.*)\s+\((.*):(\d*)()\)/i;

/**
 * Parses the call site at the specified depth from a stack trace.
 * @param stack The stack trace string, typically from an Error object.
 * @param callerDepth The depth of the caller function in the stack. Zero means the immediate caller.
 */
export function parseCallSite(stack: string, callerDepth: number): CallSite | null {
  let list = stack.trim().split('\n');

  // In V8 the first line is the error message, we'll skip that
  if (list[0].endsWith('Error') || list[0].includes('Error: ')) {
    list = list.slice(1);
  }

  const line = list[callerDepth] || '';
  const match = stackRegex1.exec(line)
    || stackRegex2.exec(line)
    || stackRegex3.exec(line)
    || stackRegex4.exec(line);

  if (match && match.length === 5) {
    return {
      function: match[1] || '',
      file: match[2] || '',
      line: match[3] || '',
      position: match[4] || '',
    };
  }

  return null;
}

/**
 * Gets the call site of the caller function.
 * @param callerDepth The depth of the caller function in the stack. Default is 0, which means the immediate caller.
 */
export function getCaller(callerDepth: number = 0): CallSite | null {
  return parseCallSite(new Error().stack || '', callerDepth + 1);
}
