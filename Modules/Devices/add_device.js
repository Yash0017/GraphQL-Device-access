const express = require('express');
const Devices = require('../../Database/deviceschema');
const routes = express.Router();

const add = async (req, res) => {
    const {name, id, info, status} = req.body;
    let device = await Devices.findOne({"id": id});
    if (device) {
        return res.status(400).json({});
    } else {
        let new_device = new Devices({name, id, info, status});
        try {
            return res.status(201).json({device: await new_device.save()});
        } catch(e) {
            return res.status(401).json({})
        }
    }
}
routes.use(express.json());
routes.post('/add', add);
module.exports = routes;