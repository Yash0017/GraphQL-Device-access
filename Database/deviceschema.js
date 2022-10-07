const mongoose = require('mongoose')
const moment = require('moment')

const Deviceschema = mongoose.Schema({
    name: {
        type: String
    },
    id: {
        type: String
    },
    info: {
        type: String,
    },
    created: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a')
    },
    data: {
        type: String,
    },
    version: {
        type: String,
    },
    parameters: [{
        p1: {
            type: String,
        },
        p2: {
            type: String,
        },
        p3: {
            type: String,
        },
        p4: {
            type: String,
        },
        p5: {
            type: String,
        },
        p6: {
            type: String,
        },
        p7: {
            type: String,
        },
        p8: {
            type: String,
        },
        p9: {
            type: String,
        },
        p10: {
            type: String,
        },
        p11: {
            type: String,
        }
    }]
});

module.exports = mongoose.model('Devices', Deviceschema);