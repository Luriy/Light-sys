export default function getCardsByCurrency(currency) {
	return this.cards.filter(({ Currency }) => Currency === currency);
}
