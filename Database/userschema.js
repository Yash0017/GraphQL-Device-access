const mongoose = require('mongoose')
const moment = require('moment')

const Userschema = mongoose.Schema({
    name: {
        type: String,
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
    role: {
        type: String,
    },
    password: {
        type: String,
    },
    created: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
    approved: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
    }
});

module.exports = mongoose.model('Users', Userschema);
