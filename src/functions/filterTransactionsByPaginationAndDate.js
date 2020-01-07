const filterByDateTimeFunc = (a, b) => {
	if (a.time < b.time) return -1;
	else if (a.time > b.time) return 1;
	else return 0;
};
const filterByDateFunc = (a, b) => {
	if (a.date < b.date) return -1;
	else if (a.date > b.date) return 1;
	else return 0;
};

export default function filterTransactionsByPaginationAndDate({
	transactions: _transactions = [],
	transactionsPerPage,
}) {
	let transactions = [..._transactions]; // don't mutate
	if (transactions.length) {
		let transactionsWithPagination = new Array(
			Math.ceil(transactions.length / transactionsPerPage),
		).fill([]);

		transactions.sort(filterByDateTimeFunc);
		transactions.reverse();

		transactions.forEach((item, index) => {
			const currentIndex = Math.floor(index / transactionsPerPage);
			transactionsWithPagination[currentIndex] = [
				...transactionsWithPagination[currentIndex],
				item,
			];
		});

		transactionsWithPagination = transactionsWithPagination.map((transactions) => {
			let datesWithTransactions = [];
			const dates = [];
			transactions.forEach(({ time }) => {
				if (
					dates.every(
						(date) =>
							date.getDate() !== new Date(Date.parse(time)).getDate() ||
							date.getMonth() !== new Date(Date.parse(time)).getMonth() ||
							date.getFullYear() !== new Date(Date.parse(time)).getFullYear(),
					)
				) {
					dates.push(new Date(Date.parse(time)));
				}
			});

			transactions.forEach((transaction) => {
				const date = dates.find((date) => {
					return (
						date.getDate() === new Date(Date.parse(transaction.time)).getDate() &&
						date.getMonth() === new Date(Date.parse(transaction.time)).getMonth() &&
						date.getFullYear() === new Date(Date.parse(transaction.time)).getFullYear()
					);
				});

				const addedTransObject = datesWithTransactions.find(
					({ date: dateTrans }) =>
						new Date(Date.parse(dateTrans)).getDate() === date.getDate() &&
						new Date(Date.parse(dateTrans)).getMonth() === date.getMonth() &&
						new Date(Date.parse(dateTrans)).getFullYear() === date.getFullYear(),
				);
				if (addedTransObject) {
					addedTransObject.transactions = [...addedTransObject.transactions, transaction];
				} else {
					datesWithTransactions = [
						...datesWithTransactions,
						{
							date,
							transactions: [
								...(datesWithTransactions.find(({ date }) => date === transaction.time) || []),
								transaction,
							],
						},
					];
				}
			});

			datesWithTransactions = datesWithTransactions.map((obj) => {
				return {
					...obj,
					transactions: obj.transactions.slice(),
				};
			});
			datesWithTransactions.sort(filterByDateFunc);
			return datesWithTransactions.reverse();
		});

		return transactionsWithPagination;
	} else {
		return [];
	}
}
