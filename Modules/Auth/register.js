const express = require('express');
const Users = require('../../Database/userschema');
const bcrypt = require('bcryptjs');
const routes = express.Router();
const register = async (req, res) => {
    console.log(req.body);
    const {name, email, role, password} = req.body;
    let user = await Users.findOne({"email": email});
    if (user) {
        return res.status(400).json({});
    } else {
        let newuser = new Users({
            "name": name,
            "email": email,
            "role": role,
            "approved": false,
            "status": "waiting",
        })
        const salt = await bcrypt.genSalt();
        newuser.password = await bcrypt.hash(password, salt);
        try {
            return res.status(201).json({user: await newuser.save()});
        } catch(e) {
            return res.status(401).json({});
        }
    }
};
routes.use(express.json());
routes.post('/register', register);
module.exports = routes;