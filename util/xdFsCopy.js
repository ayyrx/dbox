'use strict'; // 2021-01-24 19.10
const fs = require('fs');
const path = require('path');
/**
creates a copy of `src` file or directory at `dst` path
- both `src` and `dst` paths must be absolute.
- if `dst` already exists, it is removed before `src` is copied - directories aren't merged
*/
function xdFsCopy(src, dst, __isRecursiveCall = false) {
    if (!__isRecursiveCall && fs.existsSync(dst))
        fs.rmSync(dst, { recursive: true });
    if (fs.statSync(src).isDirectory()) {
        fs.mkdirSync(dst, { recursive: true });
        for (const itemName of fs.readdirSync(src)) {
            xdFsCopy(path.join(src, itemName), path.join(dst, itemName), true);
        }
    }
    else {
        fs.mkdirSync(path.parse(dst).dir, { recursive: true });
        fs.copyFileSync(src, dst);
    }
}
exports.xdFsCopy = xdFsCopy;
