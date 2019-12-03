export default function formatPhoneNumber(number) {
	const arrayOfNumerals = number.split('');
	const formattedArrayOfNumeral = arrayOfNumerals.map((numeral, index) => {
		if (index === 0) {
			return '+' + numeral + ' ';
		} else if (index === 1) {
			return '(' + numeral;
		} else if (index === 3) {
			return numeral + ') ';
		} else if (index === 6) {
			return numeral + ' ';
		} else if (index === 8) {
			return numeral + '-';
		} else return numeral;
	});

	return formattedArrayOfNumeral.join('');
}
