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
}

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
