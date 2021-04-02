'use strict'; // 2020-08-26 15.15
/**
passes a string through arrays of whitelist and blacklist regular expressions, returns `true`
if the string is matched by any whitelist regexp and is not matched by any blacklist regexps
@example
 // false - no whitelist matches
xdStringFilter('lorem ipsum dolor', { whitelist: [/foo/i, /bar/i] })

 // false - whitelist match, but also a blacklist match
xdStringFilter('lorem ipsum dolor', { whitelist: [/lorem/i], blacklist: [/ipsum/i] })

 // true  - whitelist match, no blacklist matches
xdStringFilter('lorem ipsum dolor', { whitelist: [/lorem/i], blacklist: [/foo/, /bar/] })
*/
function xdStringFilter(string, opts) {
    // whitelist
    let pass = false;
    for (const re of opts.whitelist) {
        if (re.test(string)) {
            pass = true;
            break;
        }
    }
    if (!pass)
        return false;
    // blacklist
    if (opts.blacklist) {
        for (const re of opts.blacklist) {
            if (re.test(string)) {
                return false;
            }
        }
    }
    //
    return true;
}
exports.xdStringFilter = xdStringFilter;
