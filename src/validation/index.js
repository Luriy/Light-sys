export const VALIDATE_AMOUNT_TRANSFER_EXCHANGE = (value, balance, minAmount, currencyName) => {
	if (Number(value) <= Number(minAmount)) {
		return `Amount must be more than ${minAmount} ${currencyName}`;
	} else if (Number(value) > Number(balance)) {
		return 'Amount must be less than balance of your wallet.';
	} else return null;
};
export const VALIDATE_ADDRESS = (address, currencyName) => {
	if (address === null) {
		return `Enter ${currencyName} address.`;
	} else if (address.toString().length < 5) {
		return `Enter correct ${currencyName} address.`;
	} else return null;
};
export const VALIDATE_CARD = ({ number, date, name, cvv, psid }) => {
	if (number.toString().length < 19) {
		return `Enter correct card number.`;
	} else if (date.toString().length < 5) {
		return `Enter correct date.`;
	} else if (name.toString().length < 3) {
		return `Enter correct full name.`;
	} else if (cvv.toString().length < 3) {
		return `Enter correct CVV.`;
	} else if (!psid) {
		return `You need to choose bank.`;
	} else return null;
};
