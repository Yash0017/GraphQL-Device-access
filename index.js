const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {connect} = require('./Database/connect');
const login = require('./Modules/Auth/login');
const register = require('./Modules/Auth/register');
const getuser = require('./Modules/Account/getuser');
const approve = require('./Modules/Auth/approve');
const remove = require('./Modules/Auth/remove');
const add = require('./Modules/Devices/add_device');
const getdevice = require('./Modules/Devices/getdevice');
const resolver = require('./Modules/Graphql/Resolver');
const typedef = require('./Modules/Graphql/Typedefs');
connect();
const app = express();
const Server = new ApolloServer({typeDefs: typedef, resolvers: resolver});
app.get('/Quadrant', async (req, res) => {
    res.json({message: "Quadrant Measurements site"})
});
app.use('/user', [login, register, getuser]);
app.use('/action', [approve, remove]);
app.use('/device', [add, getdevice]);
Server.applyMiddleware({app});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`You are currently using our Port ${PORT}`));