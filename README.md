a tiny utility for manual conditional directory backups

## install

`npm i -g r1vn/dbox` as root/admin

or [download](https://github.com/r1vn/dbox/archive/refs/heads/master.zip) and unpack somewhere, then `ln -s /somewhere/dbox/index.js ~/bin/dbox; chmod +x ~/bin/dbox`

## use

- navigate to the directory you want to backup in the terminal
- run `dbox -init` to create `.dbox` manifest file in it
- edit the manifest to specify the directory where snapshots will be placed and the filters for the files/directories
- run `dbox` to create a snapshot

## example

assuming the directory you want to backup as `c:\foo` with the following contents:

```
c:\foo\.git
c:\foo\lib
c:\foo\node_modules
c:\foo\index.js
```

- `cd c:/foo` in the terminal and run `dbox -init` to create a `.dbox` manifest, then edit it:

```ecmascript 6
// absolute or relative path of the directory that will store snapshots  
exports.storage = 'c:/backups/foo'     

// optional part of snapshot dirname
exports.name = '[foo]'    

// files and subdirectories must match any regular expression in this array to be included in the snapshot. defaults to `[/.*/]`, whitelisting everything  
// whitelist/blacklist regexps are matched against relative paths of files/subdirectories in cwd with "/" separators on both posix and win32
exports.whitelist = [ /.*/ ]  

// files and subdirectories must not match any regular expressions in this array to be included in the snapshot. defaults to `[]`, blacklisting nothing 
exports.blacklist = [ /\.git/, /node_modules/ ]       
```

- run `dbox` to create a snapshot.\
assuming current datetime as 2017-08-27 10.22, the copy will be created as `c:/backups/foo/2017-08-27 10.22 [foo]`\
`c:\foo\.git`, `c:/foo/node_modules` and their contents are not included in the snapshot according to the blacklist.\
additional arguments passed to `dbox` command are added to snapshot directory name, e.g. running `dbox lorem ipsum dolor` instead of `dbox` in the example above
would produce `c:/backups/foo/2017-08-27 10.22 [foo] lorem ipsum dolor`