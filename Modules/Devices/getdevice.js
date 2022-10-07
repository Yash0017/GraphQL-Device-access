const express = require('express');
const Devices = require('../../Database/deviceschema');
const routes = express.Router();
//version wise search and id
//search only name
const getdevice = async (req, res) => {
    let device = await Devices.findOne({"id": req.body.id});
    if (device) {
        return res.json(device)
    } else {
        escape.status(404).json({});
    }
}
routes.use(express.json());
routes.post('/find', getdevice);
module.exports = routes;