#!/usr/bin/env node

'use strict' // 2021-04-02 02.26

const fs = require('fs')
const path = require('path')

void function main ()
{
    process.on('uncaughtException', err =>
    {
        console.log('='.repeat(40))
        console.log(err)
        console.log('='.repeat(40) + '\nterminated')
        process.exit(1)
    })

    const manifestPathAbs = `${ process.cwd() }/.dbox`

    // init
    if (!fs.existsSync(manifestPathAbs))
    {
        if (process.argv[2] === '-init')
        {
            const manifest = `\
exports.storage   = ''
exports.name      = '[${ path.basename(process.cwd()) }]'
exports.whitelist = [/.*/]
exports.blacklist = []`

                fs.writeFileSync(manifestPathAbs, manifest)
                console.log(`initialized .dbox manifest\nedit it to set the storage directory`)
        }
        else
        {
            throw `missing .dbox manifest. run 'dbox -init' to initialize it`
        }
    }
    // snapshot
    else
    {
        const { xdDatetimeFormat } = require('./util/xdDatetimeFormat')
        const { xdDirScan } = require('./util/xdDirScan')
        const { xdFsCopy } = require('./util/xdFsCopy')
        const { xdStringFilter } = require('./util/xdStringFilter')

        // loading and validating the manifest

        try
        {
            var manifest = require(manifestPathAbs)
        }
        catch (err)
        {
            throw `failed to load the manifest: ${ err.message }`
        }

        const keys = ['storage', 'name', 'whitelist', 'blacklist']

        for (const key of keys)
        {
            if (!manifest.hasOwnProperty(key))
            {
                throw `missing property in the manifest: ${ key }`
            }
        }

        for (const key in manifest)
        {
            if (!keys.includes(key))
            {
                throw `unrecognized property in the manifest: ${ key }`
            }
        }

        if (!manifest.storage) throw `no snapshot storage directory specified`

        for (const arr of [manifest.whitelist, manifest.blacklist])
        {
            if (!(arr instanceof Array))
            {
                throw `whitelist and blacklist in the manifest must be arrays of regular expressions`
            }

            for (const el of arr)
            {
                if (!(el instanceof RegExp))
                {
                    throw `whitelist and blacklist in the manifest must be arrays of regular expressions`
                }
            }
        }

        // processing

        let id = `${ xdDatetimeFormat(new Date(), '{yyyy}-{MM}-{dd} {hh24}.{mm}') } ${ manifest.name }`
        if (process.argv.length > 2) id += ` ${ process.argv.slice(2).join(' ') }`
        id = id.replace(/\//g, '_')
        if (process.platform === 'win32') id = id.replace(/[<>:"\\|?*]+/g, '_')
        let snapshotDirAbs = path.resolve(manifest.storage, id)
        if (fs.existsSync(snapshotDirAbs)) snapshotDirAbs = `${ snapshotDirAbs } [${ Date.now() }]`
        console.log(snapshotDirAbs)

        try
        {
            fs.mkdirSync(snapshotDirAbs, { recursive: true })
        }
        catch (err)
        {
            throw `failed to create snapshot directory:\n${ err.message }`
        }

        const files = xdDirScan(process.cwd(), 'files').filter(path => xdStringFilter(path, { whitelist: manifest.whitelist, blacklist: manifest.blacklist }))
        for (const relpath of files)
        {
            xdFsCopy(`${ process.cwd() }/${ relpath }`, `${ snapshotDirAbs }/${ relpath }`)
        }

        // empty dirs
        const dirs = xdDirScan(process.cwd(), 'dirs').filter(path => xdStringFilter(path, { whitelist: manifest.whitelist, blacklist: manifest.blacklist }))
        for (const relpath of dirs)
        {
            if (!fs.existsSync(`${ snapshotDirAbs }/${ relpath }`)) fs.mkdirSync(`${ snapshotDirAbs }/${ relpath }`, { recursive: true })
        }

        console.log(`OK (${ process.uptime().toFixed(2) }s)`)
    }
}()