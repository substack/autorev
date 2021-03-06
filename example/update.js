var autorev = require('../');
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
