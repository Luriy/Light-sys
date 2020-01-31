import formatMoney from '@/functions/formatMoney';

export const VALIDATE_AMOUNT_TRANSFER_EXCHANGE = (value, balance, minAmount, currencyName) => {
	if (Number(value).toFixed(5) < Number(minAmount).toFixed(5)) {
		return `Amount must be more than ${formatMoney(minAmount, 'crypto')} ${currencyName}`;
	} else if (Number(value).toFixed(5) > Number(balance).toFixed(5)) {
		return 'Amount must be less than balance of your wallet.';
	} else return null;
};
export const VALIDATE_ADDRESS = (address, currencyName, currentAddress) => {
	if (address === null) {
		return `Enter ${currencyName} address.`;
	} else if (address.toString().length < 5) {
		return `Enter correct ${currencyName} address.`;
	} else if (address.toString().toLowerCase() === currentAddress.toString().toLowerCase()) {
		return `You can't make transfer to current wallet.`;
	} else return null;
};
export const VALIDATE_CARD = ({ number, name, psid, cards }) => {
	if (number.toString().length < 19) {
		return `Enter correct card number.`;
	} else if (cards.some((card) => card.Number === number.replace(/\s+/g, ''))) {
		return `This card is already registered.`;
	} else if (name.toString().length < 3) {
		return `Enter correct full name.`;
	} else if (!psid) {
		return `You need to choose bank.`;
	} else return null;
};
