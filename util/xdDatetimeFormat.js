'use strict'; // 2020-08-26 14.43
const funTokens = {
    '{yy}': (date) => date.getFullYear().toString().slice(2),
    '{yyyy}': (date) => date.getFullYear().toString(),
    '{M}': (date) => (date.getMonth() + 1).toString(),
    '{MM}': (date) => (date.getMonth() + 1).toString().padStart(2, '0'),
    '{d}': (date) => date.getDate().toString(),
    '{dd}': (date) => date.getDate().toString().padStart(2, '0'),
    '{h24}': (date) => date.getHours().toString(),
    '{hh24}': (date) => date.getHours().toString().padStart(2, '0'),
    '{h12}': (date) => date.toLocaleString('en-US', { hour: 'numeric' }).split(' ')[0],
    '{hh12}': (date) => date.toLocaleString('en-US', { hour: '2-digit' }).split(' ')[0],
    '{m}': (date) => date.getMinutes().toString(),
    '{mm}': (date) => date.getMinutes().toString().padStart(2, '0'),
    '{s}': (date) => date.getSeconds().toString(),
    '{ss}': (date) => date.getSeconds().toString().padStart(2, '0'),
    '{ms}': (date) => date.getMilliseconds().toString(),
    '{msmsms}': (date) => date.getMilliseconds().toString().padStart(3, '0'),
    '{p}': (date) => date.toLocaleString('en-US', { hour: 'numeric' }).split(' ')[1].toLowerCase(),
    '{mon}': (date) => date.toLocaleString('en-US', { month: 'short' }).toLowerCase(),
    '{month}': (date) => date.toLocaleString('en-US', { month: 'long' }).toLowerCase(),
    '{wday}': (date) => date.toLocaleString('en-US', { weekday: 'short' }).toLowerCase(),
    '{weekday}': (date) => date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
};
/**
formats a `Date` object into a string according to the specified format.<br>
tokens:<br>
`{yy}` - year  <br>
`{yyyy}` - full year  <br>
`{M}` - month 1-12 <br>
`{MM}` - month 01-12 (0-padded)  <br>
`{mon}` / `{Mon}` / `{MON}` - truncated month name - jan / Jan / JAN  <br>
`{month}` / `{Month}` / `{MONTH}` - full month name - january / January / JANUARY  <br>
`{d}` - day, 1-31  <br>
`{dd}` - day, 01-31  <br>
`{h24}` - 24h hour 0-23  <br>
`{hh24}` - 24h hour 00-23  <br>
`{h12}` - 12h hour 1-12    <br>
`{hh12}` - 12h hour 01-12  <br>
`{m}` - minutes 0-59  <br>
`{mm}` - minutes 00-59  <br>
`{s}` - seconds, 0-59  <br>
`{ss}` - seconds, 00-59  <br>
`{ms}` - miliseconds, 0-999  <br>
`{msmsms}` - miliseconds, 000-999  <br>
`{weekday}` / `{Weekday}` / `{WEEKDAY}` - full weekday, e.g. saturday / Saturday / SATURDAY  <br>
`{wday}` / `{Wday}` / `{WDAY}` - truncated weekday, e.g. sat / Sat / SAT  <br>
`{p}` / `{P}` - time period, am / pm or AM / PM
@example
xdDatetimeFormat(new Date(), '{yyyy}-{MM}-{dd} {hh24}:{mm}:{ss}.{msmsms}') // 2020-10-15 13:37:00.000
xdDatetimeFormat(new Date(), '{MM}-{dd}-{yyyy} ({Wday}) {h12}:{mm} {P}')   // 10-15-2020 (Sun) 1:37 PM
*/
function xdDatetimeFormat(date, format) {
    const formatTokens = format.match(/{.*?}/g);
    if (!formatTokens) {
        throw new Error(`no tokens in the format string: ${format}`);
    }
    let output = format;
    for (const token of formatTokens) {
        if (funTokens[token]) {
            output = output.replace(token, funTokens[token](date));
        }
        else if (funTokens[token.toLowerCase()]) {
            let out = funTokens[token.toLowerCase()](date);
            if (token === token.toUpperCase()) {
                out = out.toUpperCase();
            }
            else {
                out = out[0].toUpperCase() + out.slice(1);
            }
            output = output.replace(token, out);
        }
        else {
            throw new Error(`unrecognized token in the format string: ${token}`);
        }
    }
    return output;
}
exports.xdDatetimeFormat = xdDatetimeFormat;
