export default function formatCardNumber(card) {
	return card
		? card
				.split('')
				.map((letter, index) => {
					if (index === 3 || index === 7 || index === 11) {
						return (letter += ' ');
					} else return letter;
				})
				.join('')
		: '';
}
