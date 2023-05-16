const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const shortMonthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortMonthArrayLow = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const date = new Date().toDateString();
const resource1 = { name: 'Geomage.com', status: 200, lastActive: 'now', lastTry: date, memoryLeft: 500, totalMemory: 8000 }
const resource2 = { name: '89.192.15.12', status: 200, lastActive: 'now', lastTry: date }
const resource3 = { name: 'nebius', status: 404, lastActive: 'Yesterday', lastTry: date, memoryLeft: 300, totalMemory: 2000 }
const resource4 = { name: 'cloud.il', status: 500, lastActive: '13.04.2023 17:26:49', lastTry: date, memoryLeft: 320, totalMemory: 4000 }
const resource5 = { name: '89.192.15.11', status: 208, lastActive: '12.11.2022 03:04:56', lastTry: date }

export const resources = [resource1, resource2, resource3, resource4, resource5];
export const resources1 = [resource1];

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
	return str;
};
