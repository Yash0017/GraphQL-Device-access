const express = require('express');
const Users = require('../../Database/userschema');
const routes = express.Router();
const remove = async (req, res) => {
    const {name} = req.body;
    let user = await Users.findOne({"name": name});
    if (user) {
        let update = await Users.findOneAndUpdate({"name": name},{
            "approved": false,
        });
        if (update) {
            return res.status(200).json({});
        }
    } else {
        return res.status(404).json({message: 'User not Found'});
    }
}
routes.use(express.json());
routes.post('/reject', remove);
module.exports = routes;