#!/usr/bin/env node
var autorev = require('../');
var fs = require('fs');
var vm = require('vm');

if (process.argv.length <= 2) {
    console.error([
        'Usage:',
        '',
        '  autorev uri',
        '    read docs from stdin',
        '',
        '  autorev uri [file,...]',
        '    read docs from filenames',
    ].join('\n'));
}
else {
    var uri = process.argv[2];
    var streams = [];
    
    if (process.argv.length === 3 || process.argv[4] === '-') {
        streams.push(process.stdin);
    }
    else {
        process.argv.slice(3).forEach(function (file) {
            streams.push(fs.createReadStream(file));
        });
    }
    
    streams.forEach(function (s) {
        var data = '';
        s.on('data', function (buf) { data += buf });
        s.on('end', function () {
            try {
                var doc = JSON.parse(data);
            }
            catch (err0) {
                var doc = vm.runInNewContext('(' + data + ')');
            }
            autorev(uri, doc).pipe(process.stdout, { end : false });
        });
        s.resume();
    });
}
