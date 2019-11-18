export const VALIDATE_AMOUNT_TRANSFER_EXCHANGE = (value, balance, minAmount, currencyName) => {
	if (value <= minAmount) {
		return `Amount must be more than ${minAmount} ${currencyName}`;
	} else if (value > balance) {
		return 'Amount must be less than balance of your wallet.';
	} else return null;
};
export const VALIDATE_ADDRESS = (address, currencyName) => {
	if (address === null) {
		return `Enter ${currencyName} address.`;
	} else if (address.length < 5) {
		return `Enter correct ${currencyName} address.`;
	} else return null;
};
export const VALIDATE_CARD = ({ number, date, name, cvv, psid }) => {
	console.log(number, date, name, cvv, psid);
	if (number.length < 19) {
		return `Enter correct card number.`;
	} else if (date.length < 5) {
		return `Enter correct date.`;
	} else if (name.length < 3) {
		return `Enter correct full name.`;
	} else if (cvv.length < 3) {
		return `Enter correct CVV.`;
	} else if (!psid) {
		return `You need to choose bank.`;
	} else return null;
};
