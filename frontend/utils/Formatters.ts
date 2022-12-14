export const shortMonthFormatter = (date: Date) => { // Formats to short month name, e.g. "Nov", "Jun", "Okt"
    const formatter = new Intl.DateTimeFormat('no', { month: 'short' });
    const shortDateName = formatter.format(date);
    return shortDateName.charAt(0).toUpperCase() + shortDateName.slice(1)
};

export const longMonthFormatter = (date: Date) => { // Formats to long month name, e.g. "November", "Juni"
    const formatter = new Intl.DateTimeFormat('no', { month: 'long' });
    const longDateName = formatter.format(date);
    return longDateName.charAt(0).toUpperCase() + longDateName.slice(1) + " " + date.getFullYear()
}

export const amountFormatter = (amount: number) => {  // Formats number to compact, e.g. 2413560 --> "2,4 mill."
    const formatter = Intl.NumberFormat('no', { notation: 'compact' });
    return formatter.format(amount)
}

export const splitAmountFormatter = (amount: number) => {  // Formats number to split format, e.g. 27662930 --> 27 662 930  
    if (Number.isInteger(amount)) return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    else return amount
}
export const singleDecimalFormatter = (num: number) => {  // Takes in decimal number and returns string with 1 decimal, e.g. 10.3324 --> 10.3
  var rounded = Math.round(num * 10) / 10
  return rounded.toFixed(1)
}

export const percentChange = (num1: number, num2: number) => {  // Calculates percentage difference between num1 and num2, e.g. 10, 20 --> 100.0
  return ((num2 - num1) /num1 )*100
}
