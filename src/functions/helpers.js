const None = 'None';

export function parsePythonArray(obj) {
	return eval(`(${obj})`);
}
export function parsePythonDataObject(resp) {
	return eval('(' + resp['data'] + ')');
}
