const {gql} = require('apollo-server-express');

const typedef = gql`
type Query {
    user(id: String): USER
    getmyself(date: String): USER
    getallusers: [USER]
    getdevice(id: String): Device
    getalldevices: [Device]
}

type Mutation {
    register(input: user): USER
    login(input: logininput): USER
    addDevice(input: device) : Device
}

input logininput {
    name: String
    email: String
    password: String
}

type loginresult {
    token: String
    msg: String
}

input user {
    name: String
    email: String
    password: String
}

type USER {
    _id: ID
    name: String
    email: String
    role: String
    status: String
    dob: String
    rgdate: String
}

input device {
    name: String
    id: String
    version: String
    info: String
}

type Device {
    _id: ID
    name: String
    id: String
    version: String
    created: String
    info: String
}
`;

module.exports = typedef;