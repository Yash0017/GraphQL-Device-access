const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/quadm';
const connect = async () => {
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.set('debug', true);

    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Connected to Quadrant Measurements Database.')
    });
    connection.on('error', () => console.error(error));
};
module.exports = {connect};