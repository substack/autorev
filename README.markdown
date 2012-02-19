autorev
=======

Blindly update couchdb documents by pulling down the latest _rev and bolting it
to the document. This is useful for synchronizing design documents where source
control holds the definitive copy.

examples
========

command-line
------------

record.js

``` js
{
    _id : '_design/record',
    views : {
        all : function (doc) {
            if (doc.type === 'record') emit(null, doc)
        },
        by_experiment : function (doc) {
            if (doc.type === 'record') emit(doc.experiment, doc)
        },
        by_session : function (doc) {
            if (doc.type === 'record') emit(doc.session, doc)
        }
    }
}
```

output

```
$ autorev http://localhost:5984/experiments record.js
{"ok":true,"id":"_design/record","rev":"1-36194dcb0ade1549f4aed8c261b2c5f6"}
$ autorev http://localhost:5984/experiments record.js 
# not updated
```

programatically

``` js
var autorev = require('autorev');
autorev('http://localhost:5984/experiments', {
    _id : '_design/record',
    views : {
        all : function (doc) {
            if (doc.type === 'record') emit(null, doc)
        },
        by_experiment : function (doc) {
            if (doc.type === 'record') emit(doc.experiment, doc)
        },
        by_session : function (doc) {
            if (doc.type === 'record') emit(doc.session, doc)
        }
    }
}).pipe(process.stdout);
```

methods
=======

var autorev = require('autorev')

autorev(uri, doc)
-----------------

Update the document in the database at `uri` with `doc`. `doc` should have an
`_id` field at the very least. The `_rev` field will be fetched from the latest
revision and used to blindly update the document.

To use http basic auth just format `uri` like this:
`"http://user:pass@host:port/dbname"`.

Return a stream with the server response or `"# not updated\n"` if the document
didn't change.

command-line usage
==================

```
Usage:

  autorev uri
    read docs from stdin

  autorev uri [file,...]
    read docs from filenames
```

install
=======

To get the command, with [npm](http://npmjs.org) do:

```
npm install -g autorev
```

To get the library, with [npm](http://npmjs.org) do:

```
npm install autorev
```

license
=======

MIT/X11
