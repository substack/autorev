var request = require('request');
var deepEqual = require('deep-equal');
var traverse = require('traverse');
var Stream = require('stream').Stream;

module.exports = function autorev (uri, doc) {
    if (doc === undefined) return autorev.bind(null, uri);
    var u = uri.replace(/\/$/, '') + '/';
    
    var out = new Stream;
    out.readable = true;
    out.writable = true;
    out.write = function (buf) { out.emit('data', buf) };
    out.end = function (buf) {
        if (buf !== undefined) out.write(buf)
        out.emit('end');
    };
    
    request.get(u + doc._id, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            var res = request.put({
                uri : u + doc._id,
                headers : { 'content-type' : 'application/json' },
            });
            res.end(stringify(doc));
            res.pipe(out);
        }
        else {
            var prevDoc = JSON.parse(body);
            doc._rev = prevDoc._rev;
            if (deepEqual(doc, prevDoc)) {
                out.end('# not updated\n');
            }
            else {
                var res = request.put({
                    uri : u + doc._id,
                    headers : { 'content-type' : 'application/json' },
                });
                res.end(stringify(doc));
                res.pipe(out);
            }
        }
    });
    
    return out;
};

function stringify (obj) {
    return JSON.stringify(traverse(obj).map(function (node) {
        if (typeof node === 'function') return node.toString();
    }));
}
