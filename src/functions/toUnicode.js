export default function toUnicode(theString) {
	let unicodeString = '';
	for (let i = 0; i < theString.length; i++) {
		let theUnicode = theString
			.charCodeAt(i)
			.toString(16)
			.toUpperCase();
		while (theUnicode.length < 4) {
			theUnicode = '0' + theUnicode;
		}
		theUnicode = '\\u' + theUnicode;
		unicodeString += theUnicode;
	}
	return unicodeString;
}
