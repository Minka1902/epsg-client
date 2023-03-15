/**
 * Receives Date object and an offset "n" representing amount of days to reduce from the initial date, and returns a new date object after reducing "n" from the initial date. Returned value is a string in the format YYYY-MM-DD. The function takes into account month and year overlaps.
 * @param date Date object
 * @param n Amount of days to reduce from original date
 * @returns ISO Formatted date string YYYY-MM-DD
 */

 const reduceDays = (date: Date, n: number): string => {
	const newDate = new Date(date);
	newDate.setDate(newDate.getDate() - n);
	return newDate.toISOString().substring(0, 10);
  };
  
  export { reduceDays };