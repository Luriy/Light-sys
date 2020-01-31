const getDecimalsLength = (x) =>
	x.toString().includes('.')
		? x
				.toString()
				.split('.')
				.pop().length
		: 0;

export default function formatMoney(value, type) {
	let fixed;
	let minFixed;
	switch (type) {
		case 'crypto':
			fixed = 5;
			minFixed = 0;
			break;
		case 'currency':
			fixed = 2;
			minFixed = 2;
			break;
		default:
			fixed = 2;
			minFixed = 0;
	}
	const number = Number(
		Number(value)
			.toFixed(fixed)
			.toString(),
	);

	if (getDecimalsLength(number) < minFixed) {
		return number.toFixed(minFixed);
	} else {
		return number;
	}
}
