export function parsePythonArray(obj) {
  return eval(`(${obj})`);
}
