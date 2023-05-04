// ! 	gets a HTML string, returns the number of words.
// TODO findElementByName("<div><h3 class="class__name">hello world!</h3></div>", 'h3');
// ?  	<h3 class="class__name">hello world!</h3>
export const wordCount = (text) => {
    const str = text.toLowerCase().replace(/[.,/#!@\\$%^&*;:{}=\-_`~()]/g, "");
    let counter = 0;
    for (let i = 0; i < str.length; i++) {
        // ! checks the a and i letters
        if ((str[i] === 'a') || (str[i] === 'i')) {
            if (str[i + 1] === ' ') {
                counter++;
                continue;
            }
        }
        // ! checks the rest of the letters
        if ((str[i] === ' ') && (str[i + 1] !== ' ')) {
            if (str[i + 1]) {
                counter++;
            }
        }
    }
    return counter;
};

// ! 	gets a url path and values to extract from it, works ONLY with numbers
// TODO getValuesFromPath({ path: '/coordinates?x=1.2,3.4,5.6&y=7.8,9.0,10.11', values: ['x', 'y'] });
// ?    [x: [1.2, 3.4, 5.6], y: [7.8, 9, 10.11]]
export const getValuesFromPath = ({ path, values }) => {
    let tempObj = [];
    for (let i = 0; i < values.length; i++) {
        let startIndex = path.indexOf(values[i]) + 2;
        let endIndex = path.indexOf('&', startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
            tempObj[values[i]] = path.slice(startIndex, endIndex);
        } else {
            endIndex = path.length;
            if (startIndex !== -1 && endIndex !== -1) {
                tempObj[values[i]] = path.slice(startIndex, endIndex);
            }
        }
        tempObj[values[i]] = tempObj[values[i]].split(',').map(parseFloat)
    }
    return tempObj;
};

// ! 	gets a string and the desired length.
// TODO changeStringLength("i am michael scharff", 12);
// ?  	i am michael
export const changeStringLength = (str, desiredLength) => {
    while (str.length > desiredLength) {
        str = str.substring(0, str.length - 1);
    }
};

// ! 	gets a HTML string, the element you want to exclude and true if its a react component. returns only the element.
// TODO findElementByName("<div><h3 class="class__name">hello world!</h3></div>", 'h3');
// ?  	<h3 class="class__name">hello world!</h3>
export const findElementByName = (str, elementToFind, isReactComponent = false) => {
    let newStr = '';
    const startIndex = str.indexOf(`<${elementToFind}`);
    const secondIndex = str.indexOf(`</${elementToFind}>`, (startIndex + 1));
    let endIndex = 0;
    newStr = str[startIndex];
    if (isReactComponent) {
        endIndex = str.indexOf(`/>`, (startIndex + 1)) + 2;
    } else {
        endIndex = secondIndex + elementToFind.length + 3;
    }
    const range = endIndex - startIndex;
    for (let i = 1; i < range; i++) {
        newStr += str[startIndex + i];
    }
    return newStr;
};

export const addClassToElement = (str, elementToFind, classToAdd) => {
    const class_name = ` class='${classToAdd}'`
    let elementIndex = str.indexOf('>', str.indexOf(elementToFind));
    return str.slice(0, elementIndex) + class_name + str.slice(elementIndex);
}

// ! 	gets an array of numbers and removes all the duplictes from it
// TODO removeDuplicates([1,1,1,2,2,3,4,5,5,5,4])
// ?  	[1,2,3,4,5]
export const removeDuplicates = (nums) => {
    let pointer = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== nums[i + 1]) {
            nums[pointer] = nums[i];
            pointer++;
        }
    }
    return nums;
};

// ! 	gets a string and returns it with the first word capitalized
// TODO capitalizeFirstWord('hello world.')
// ?  	Hello world.
export const capitalizeFirstWord = (str) => {
    return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
};

// ! 	gets 2 locations and calculates distance between them (lat, lng)
// TODO calcDistance({ lat1: 31.89286, lon1: 35.03255, lat2: 31.88159, lon2: 34.99352 })
// ?  	3.892
export const calcDistance = ({ lat1, lon1, lat2, lon2 }) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return (distance.toFixed(3));
};

// ! 	gets a numeric degree and converts it to radians
// TODO deg2rad(31.88159 - 31.89286)
// ?  	-0.00019669860669975517
const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

// ! 	gets a string and returns it as 5 words and ... at the end
// TODO shortenString("This is a long string with more than five words in it.")
// ?  	This is a long string with ...
export const shortenString = (str) => {
    let words = str.trim().split(/\s+/);
    let shortStr = words.slice(0, 5).join(" ");
    if (words.length > 5) {
        shortStr += " ...";
    }
    return shortStr;
};

export const mincostTickets = (days, costs) => {
    const [_1day, _7day, _30day] = [0, 1, 2];
    let travelDays = new Set(days);
    let lastTravelDay = days[days.length - 1];
    let dpCost = new Array(lastTravelDay + 1).fill(0);
    for (let day_i = 1; day_i <= lastTravelDay; day_i++) {
        if (travelDays.has(day_i) === false) {
            dpCost[day_i] = dpCost[day_i - 1];
        } else {
            dpCost[day_i] = Math.min(
                dpCost[day_i - 1] + costs[_1day],
                dpCost[Math.max(day_i - 7, 0)] + costs[_7day],
                dpCost[Math.max(day_i - 30, 0)] + costs[_30day]
            );
        }
    }
    return dpCost[lastTravelDay];
};

export const partitionString = (str) => {
    const n = str.length;
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= n; i++) {
        const seen = new Set();
        for (let j = i - 1; j >= 0; j--) {
            if (seen.has(str[j])) break;
            seen.add(str[j]);
            dp[i] = Math.min(dp[i], dp[j] + 1);
        }
    }
    return dp[n];
};

export const numRescueBoats = (people, limit) => {
    people.sort((a, b) => a - b);

    let left = 0;
    let right = people.length - 1;
    let rides = 0;

    while (left <= right) {
        if (people[left] + people[right] <= limit) {
            left++;
            right--;
            rides++;
        } else {
            right--;
            rides++;
        }
    }

    return rides;
};

// ! 	gets an element and id and returns the class list of the desired element 
// TODO getClassListById(element, 'ID');
// ?  	class anotherClass andAnotherClass
export const getClassListById = (elem, idToFind) => {
    if (elem.id === idToFind) {
        return elem.classList;
    } else {
        return getClassListById(elem.parentElement, idToFind);
    }
}

// ! 	gets the number of seconds you want it to wait
// TODO wait(5)
// ?  	waits 5 seconds
export const wait = async (secs) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1000 * secs);
};