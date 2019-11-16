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
		return `Enter valid ${currencyName} address.`;
	} else return null;
};
export const VALIDATE_CARD = (psid) => {
	if (!psid) {
		return `You need to choose bank.`;
	} else return null;
};
