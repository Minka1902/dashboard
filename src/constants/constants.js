export const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const shortMonthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const shortMonthArrayLow = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const date = new Date().toDateString();
const resource1 = { name: 'Geomage.com', status: 200, lastActive: 'now', lastTry: date, memoryLeft: 500, totalMemory: 8000 }
const resource2 = { name: '89.192.15.12', status: 200, lastActive: 'now', lastTry: date }
const resource3 = { name: 'nebius', status: 404, lastActive: 'Yesterday', lastTry: date, memoryLeft: 300, totalMemory: 2000 }
const resource4 = { name: 'cloud.il', status: 500, lastActive: '13.04.2023 17:26:49', lastTry: date, memoryLeft: 320, totalMemory: 4000 }
const resource5 = { name: '89.192.15.11', status: 208, lastActive: '12.11.2022 03:04:56', lastTry: date }

export const resources = [resource1, resource2, resource3, resource4, resource5];

export const memoryUnits = ['BYTES', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
