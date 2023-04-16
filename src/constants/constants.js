const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const shortMonthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortMonthArrayLow = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// ! 	gets a month (august, Aug, 05, 12, 4) and returns the long version
// TODO findMonth("Aug"); findMonth("8"); findMonth("08"); findMonth("august");
// ?  	August
export const findMonth = ({ month, isShortMonth }) => {
	let index = 0;
	if (typeof month === "number") {
		index = month;
	} else {
		if (month.length === 3) {
			index = shortMonthArrayLow.indexOf(`${month}`);
		} else {
			index = monthArray.indexOf(`${month}`);
		}
	}
	return isShortMonth ? shortMonthArray[index] : monthArray[index];
};


// ! 	gets a string and the desired length
// TODO changeStringLength("i am michael scharff", 12);
// ?  	i am michael
export const changeStringLength = (str, desiredLength) => {
	while (str.length > desiredLength) {
		str = str.substring(0, str.length - 1);
	}
};
