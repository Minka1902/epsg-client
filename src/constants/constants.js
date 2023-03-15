const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const shortMonthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ! 	gets a month (august, Aug, 05, 12, 4) and returns the long version
// TODO findMonth("Aug"); findMonth("8"); findMonth("08"); findMonth("august");
// ?  	August
const findMonth = (month) => {
	let index;
	if (month.length >= 2) {
		index = Number(month) - 1;
	} else {
		if (month.length === 3) {
			index = shortMonthArray.indexOf(month);
		} else {
			index = monthArray.indexOf(month);
		}
	}
	return monthArray[index];
};


// ! 	gets a string and the desired length
// TODO changeStringLength("i am michael scharff", 12);
// ?  	i am michael
const changeStringLength = (str, desiredLength) => {
	while (str.length > desiredLength) {
		str = str.substring(0, str.length - 1);
	}
};

export default { findMonth, changeStringLength };
