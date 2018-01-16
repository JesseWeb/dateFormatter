declare var _default: {
    DateFormat: {};
    daysInWeek: string[];
    shortDaysInWeek: string[];
    shortMonthsInYear: string[];
    longMonthsInYear: string[];
    shortMonthsToNumber: {
        'Jan': string;
        'Feb': string;
        'Mar': string;
        'Apr': string;
        'May': string;
        'Jun': string;
        'Jul': string;
        'Aug': string;
        'Sep': string;
        'Oct': string;
        'Nov': string;
        'Dec': string;
    };
    YYYYMMDD_MATCHER: RegExp;
    numberToLongDay: (value: any) => any;
    numberToShortDay: (value: any) => any;
    numberToShortMonth: (value: any) => any;
    numberToLongMonth: (value: any) => any;
    shortMonthToNumber: (value: any) => any;
    parseTime: (value: any) => {
        time: any;
        hour: any;
        minute: any;
        second: any;
        millis: string;
    };
    padding: (value: any, length: any) => any;
    format: {
        parseDate: (value: any) => any;
        date: (value: any, format: any) => any;
        prettyDate: (time: Date) => string;
        toBrowserTimeZone: (value: any, format: any) => any;
    };
};
export = _default;
