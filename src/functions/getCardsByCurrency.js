export default function getCardsByCurrency(currency, cards) {
	return cards.filter(({ Currency }) => Currency === currency);
}
