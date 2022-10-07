const express = require('express');
const Users = require('../../Database/userschema');
const routes = express.Router();
const login = async (req, res) => {
    const {email, password} = req.body;
    let user = await Users.findOne({"email": email});
    if (user) {
        console.log('found');
        if (user.approved == true) {
            if (user.password === password) {
                return res.status(200).json({login: true});
            } else {
                return res.status(401).json({message: 'Invalid Password'});
            }
        } else {
            if (user.status === 'waiting') {
                return res.status(300).json({message: 'Account yet to be approved by the Admin.'})
            } else if (user.status === 'rejected') {
                return res.status(400).json({message: 'Request Rejected'});
            }
        }
    } else {
        return res.status(404).json({message: 'Email not Found'});
    }
}
routes.use(express.json());
routes.post('/login', login);
module.exports = routes;