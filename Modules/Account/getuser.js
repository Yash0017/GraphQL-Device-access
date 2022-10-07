const express = require('express');
const Users = require('../../Database/userschema');
const routes = express.Router();
const getuser = async (req, res) => {
    let user = await Users.findById(req.body.id);
    if (user) {
        return res.json(user)
    } else {
        escape.status(404).json({});
    }
}
routes.use(express.json());
routes.post('/user', getuser);
module.exports = routes;