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