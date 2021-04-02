'use strict'; // 2021-01-17 19.39
const fs = require('fs');
/**
recursive fs.readdirSync<br>
returned paths are relative. uses `/` as path separator on windows too
@example
 // Given a folder `C:\foo` with the following contents:
 // C:\foo\bar
 // C:\foo\bar\bob.txt
 // C:\foo\baz
 // C:\foo\baz\alice.txt
 // C:\foo\hello, world.txt
xdDirScan('C:/foo')
 // [
 //   'bar',
 //   'bar/bob.txt',
 //   'baz',
 //   'baz/alice.txt',
 //   'hello, world.txt'
 // ]
xdDirScan('C:/foo', 'dirs')
 // [
 //   'bar',
 //   'baz'
 // ]
xdDirScan('C:/foo', 'files')
 // [
 //   'bar/bob.txt',
 //   'baz/alice.txt',
 //   'hello, world.txt'
 // ]
*/
function xdDirScan(dirPathAbs, type = 'all', __origin = '', __isRecursiveCall = false, __itemList = []) {
    if (!__isRecursiveCall) {
        if (process.platform === 'win32') {
            dirPathAbs = dirPathAbs.replace(/\\/g, '/');
        }
        __origin = dirPathAbs = dirPathAbs.replace(/\/$/, '');
    }
    for (const dirent of fs.readdirSync(dirPathAbs, { withFileTypes: true })) {
        const itemName = dirent.name;
        const itemPathAbs = dirPathAbs + '/' + itemName;
        const itemPathRel = itemPathAbs.slice(__origin.length + 1);
        if (dirent.isDirectory()) {
            if (type === 'all' || type === 'dirs') {
                __itemList.push(itemPathRel);
            }
            xdDirScan(itemPathAbs, type, __origin, true, __itemList);
        }
        else if (type === 'all' || type === 'files') {
            __itemList.push(itemPathRel);
        }
    }
    return __itemList;
}
exports.xdDirScan = xdDirScan;
