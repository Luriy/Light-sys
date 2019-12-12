export default function uniqueizeArray(array, key) {
	const uniqueArray = [];
	array.map((item) => {
		if (
			uniqueArray.some((uniqItem) => {
				console.log(uniqItem[key], item[key], key);
				return uniqItem[key] === item[key];
			})
		) {
			return false;
		} else {
			uniqueArray.push(item);
		}
	});

	return uniqueArray;
}
