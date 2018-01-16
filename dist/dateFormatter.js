"use strict";
var _this = this;
module.exports = {
    DateFormat: {},
    daysInWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDaysInWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shortMonthsInYear: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonthsInYear: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
    shortMonthsToNumber: {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
        'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    },
    YYYYMMDD_MATCHER: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/,
    numberToLongDay: function (value) {
        return _this.daysInWeek[parseInt(value, 10)] || value;
    },
    numberToShortDay: function (value) {
        return _this.shortDaysInWeek[parseInt(value, 10)] || value;
    },
    numberToShortMonth: function (value) {
        var monthArrayIndex = parseInt(value, 10) - 1;
        return _this.shortMonthsInYear[monthArrayIndex] || value;
    },
    numberToLongMonth: function (value) {
        var monthArrayIndex = parseInt(value, 10) - 1;
        return _this.longMonthsInYear[monthArrayIndex] || value;
    },
    shortMonthToNumber: function (value) {
        return _this.shortMonthsToNumber[value] || value;
    },
    parseTime: function (value) {
        var time = value, hour, minute, second, millis = '', delimited, timeArray;
        if (time.indexOf('.') !== -1) {
            delimited = time.split('.');
            time = delimited[0];
            millis = delimited[delimited.length - 1];
        }
        timeArray = time.split(':');
        if (timeArray.length === 3) {
            hour = timeArray[0];
            minute = timeArray[1];
            second = timeArray[2].replace(/\s.+/, '').replace(/[a-z]/gi, '');
            time = time.replace(/\s.+/, '').replace(/[a-z]/gi, '');
            return {
                time: time,
                hour: hour,
                minute: minute,
                second: second,
                millis: millis
            };
        }
        return { time: '', hour: '', minute: '', second: '', millis: '' };
    },
    padding: function (value, length) {
        var paddingCount = length - String(value).length;
        for (var i = 0; i < paddingCount; i++) {
            value = '0' + value;
        }
        return value;
    },
    format: {
        parseDate: function (value) {
            var values, subValues;
            var parsedDate = {
                date: null,
                year: null,
                month: null,
                dayOfMonth: null,
                dayOfWeek: null,
                time: null
            };
            if (typeof value == 'number') {
                return _this.parseDate(new Date(value));
            }
            else if (typeof value.getFullYear == 'function') {
                parsedDate.year = String(value.getFullYear());
                parsedDate.month = String(value.getMonth() + 1);
                parsedDate.dayOfMonth = String(value.getDate());
                parsedDate.time = _this.parseTime(value.toTimeString() + "." + value.getMilliseconds());
            }
            else if (value.search(_this.YYYYMMDD_MATCHER) != -1) {
                values = value.split(/[T\+-]/);
                parsedDate.year = values[0];
                parsedDate.month = values[1];
                parsedDate.dayOfMonth = values[2];
                parsedDate.time = _this.parseTime(values[3].split('.')[0]);
            }
            else {
                values = value.split(' ');
                if (values.length === 6 && isNaN(values[5])) {
                    values[values.length] = '()';
                }
                switch (values.length) {
                    case 6:
                        parsedDate.year = values[5];
                        parsedDate.month = _this.shortMonthToNumber(values[1]);
                        parsedDate.dayOfMonth = values[2];
                        parsedDate.time = _this.parseTime(values[3]);
                        break;
                    case 2:
                        subValues = values[0].split('-');
                        parsedDate.year = subValues[0];
                        parsedDate.month = subValues[1];
                        parsedDate.dayOfMonth = subValues[2];
                        parsedDate.time = _this.parseTime(values[1]);
                        break;
                    case 7:
                    case 9:
                    case 10:
                        parsedDate.year = values[3];
                        parsedDate.month = _this.shortMonthToNumber(values[1]);
                        parsedDate.dayOfMonth = values[2];
                        parsedDate.time = _this.parseTime(values[4]);
                        break;
                    case 1:
                        subValues = values[0].split('');
                        parsedDate.year = subValues[0] + subValues[1] + subValues[2] + subValues[3];
                        parsedDate.month = subValues[5] + subValues[6];
                        parsedDate.dayOfMonth = subValues[8] + subValues[9];
                        parsedDate.time = _this.parseTime(subValues[13] +
                            subValues[14] +
                            subValues[15] +
                            subValues[16] +
                            subValues[17] +
                            subValues[18] +
                            subValues[19] +
                            subValues[20]);
                        break;
                    default:
                        return null;
                }
            }
            if (parsedDate.time) {
                parsedDate.date = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.dayOfMonth, parsedDate.time.hour, parsedDate.time.minute, parsedDate.time.second, parsedDate.time.millis);
            }
            else {
                parsedDate.date = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.dayOfMonth);
            }
            parsedDate.dayOfWeek = String(parsedDate.date.getDay());
            return parsedDate;
        },
        date: function (value, format) {
            try {
                var parsedDate = _this.parseDate(value);
                if (parsedDate === null) {
                    return value;
                }
                var year = parsedDate.year, month = parsedDate.month, dayOfMonth = parsedDate.dayOfMonth, dayOfWeek = parsedDate.dayOfWeek, time = parsedDate.time;
                var hour;
                var pattern = '', retValue = '', unparsedRest = '', inQuote = false;
                for (var i = 0; i < format.length; i++) {
                    var currentPattern = format.charAt(i);
                    var nextRight = format.charAt(i + 1);
                    if (inQuote) {
                        if (currentPattern == "'") {
                            retValue += (pattern === '') ? "'" : pattern;
                            pattern = '';
                            inQuote = false;
                        }
                        else {
                            pattern += currentPattern;
                        }
                        continue;
                    }
                    pattern += currentPattern;
                    unparsedRest = '';
                    switch (pattern) {
                        case 'ddd':
                            retValue += _this.numberToLongDay(dayOfWeek);
                            pattern = '';
                            break;
                        case 'dd':
                            if (nextRight === 'd') {
                                break;
                            }
                            retValue += _this.padding(dayOfMonth, 2);
                            pattern = '';
                            break;
                        case 'd':
                            if (nextRight === 'd') {
                                break;
                            }
                            retValue += parseInt(dayOfMonth, 10);
                            pattern = '';
                            break;
                        case 'D':
                            if (dayOfMonth == 1 || dayOfMonth == 21 || dayOfMonth == 31) {
                                dayOfMonth = parseInt(dayOfMonth, 10) + 'st';
                            }
                            else if (dayOfMonth == 2 || dayOfMonth == 22) {
                                dayOfMonth = parseInt(dayOfMonth, 10) + 'nd';
                            }
                            else if (dayOfMonth == 3 || dayOfMonth == 23) {
                                dayOfMonth = parseInt(dayOfMonth, 10) + 'rd';
                            }
                            else {
                                dayOfMonth = parseInt(dayOfMonth, 10) + 'th';
                            }
                            retValue += dayOfMonth;
                            pattern = '';
                            break;
                        case 'MMMM':
                            retValue += _this.numberToLongMonth(month);
                            pattern = '';
                            break;
                        case 'MMM':
                            if (nextRight === 'M') {
                                break;
                            }
                            retValue += _this.numberToShortMonth(month);
                            pattern = '';
                            break;
                        case 'MM':
                            if (nextRight === 'M') {
                                break;
                            }
                            retValue += _this.padding(month, 2);
                            pattern = '';
                            break;
                        case 'M':
                            if (nextRight === 'M') {
                                break;
                            }
                            retValue += parseInt(month, 10);
                            pattern = '';
                            break;
                        case 'y':
                        case 'yyy':
                            if (nextRight === 'y') {
                                break;
                            }
                            retValue += pattern;
                            pattern = '';
                            break;
                        case 'yy':
                            if (nextRight === 'y') {
                                break;
                            }
                            retValue += String(year).slice(-2);
                            pattern = '';
                            break;
                        case 'yyyy':
                            retValue += year;
                            pattern = '';
                            break;
                        case 'HH':
                            retValue += _this.padding(time.hour, 2);
                            pattern = '';
                            break;
                        case 'H':
                            if (nextRight === 'H') {
                                break;
                            }
                            retValue += parseInt(time.hour, 10);
                            pattern = '';
                            break;
                        case 'hh':
                            hour = (parseInt(time.hour, 10) === 0
                                ? 12
                                : time.hour < 13
                                    ? time.hour
                                    : time.hour - 12);
                            retValue += _this.padding(hour, 2);
                            pattern = '';
                            break;
                        case 'h':
                            if (nextRight === 'h') {
                                break;
                            }
                            hour = (parseInt(time.hour, 10) === 0
                                ? 12
                                : time.hour < 13
                                    ? time.hour
                                    : time.hour - 12);
                            retValue += parseInt(hour, 10);
                            pattern = '';
                            break;
                        case 'mm':
                            retValue += _this.padding(time.minute, 2);
                            pattern = '';
                            break;
                        case 'm':
                            if (nextRight === 'm') {
                                break;
                            }
                            retValue += time.minute;
                            pattern = '';
                            break;
                        case 'ss':
                            retValue += _this.padding(time.second.substring(0, 2), 2);
                            pattern = '';
                            break;
                        case 's':
                            if (nextRight === 's') {
                                break;
                            }
                            retValue += time.second;
                            pattern = '';
                            break;
                        case 'S':
                        case 'SS':
                            if (nextRight === 'S') {
                                break;
                            }
                            retValue += pattern;
                            pattern = '';
                            break;
                        case 'SSS':
                            var sss = '000' + time.millis.substring(0, 3);
                            retValue += sss.substring(sss.length - 3);
                            pattern = '';
                            break;
                        case 'a':
                            retValue += time.hour >= 12 ? 'PM' : 'AM';
                            pattern = '';
                            break;
                        case 'p':
                            retValue += time.hour >= 12 ? 'p.m.' : 'a.m.';
                            pattern = '';
                            break;
                        case 'E':
                            retValue += _this.numberToShortDay(dayOfWeek);
                            pattern = '';
                            break;
                        case "'":
                            pattern = '';
                            inQuote = true;
                            break;
                        default:
                            retValue += currentPattern;
                            pattern = '';
                            break;
                    }
                }
                retValue += unparsedRest;
                return retValue;
            }
            catch (e) {
                if (console && console.log) {
                    console.log(e);
                }
                return value;
            }
        },
        prettyDate: function (time) {
            var date;
            var diff;
            var day_diff;
            if (typeof time === 'string' || typeof time === 'number') {
                date = new Date(time);
            }
            if (typeof time === 'object') {
                date = new Date(time.toString());
            }
            diff = (((new Date()).getTime() - date.getTime()) / 1000);
            day_diff = Math.floor(diff / 86400);
            if (isNaN(day_diff) || day_diff < 0) {
                return;
            }
            if (diff < 60) {
                return 'just now';
            }
            else if (diff < 120) {
                return '1 minute ago';
            }
            else if (diff < 3600) {
                return Math.floor(diff / 60) + ' minutes ago';
            }
            else if (diff < 7200) {
                return '1 hour ago';
            }
            else if (diff < 86400) {
                return Math.floor(diff / 3600) + ' hours ago';
            }
            else if (day_diff === 1) {
                return 'Yesterday';
            }
            else if (day_diff < 7) {
                return day_diff + ' days ago';
            }
            else if (day_diff < 31) {
                return Math.ceil(day_diff / 7) + ' weeks ago';
            }
            else if (day_diff >= 31) {
                return 'more than 5 weeks ago';
            }
        },
        toBrowserTimeZone: function (value, format) {
            return _this.date(new Date(value), format || 'MM/dd/yyyy HH:mm:ss');
        }
    }
};
//# sourceMappingURL=dateFormatter.js.map