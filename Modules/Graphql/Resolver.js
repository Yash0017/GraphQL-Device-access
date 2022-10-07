'use strict'
const {AuthenticationError, ApolloError} = require('apollo-server-express')
const Users = require('./../../Database/userschema');
const Devices = require('./../../Database/deviceschema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const resolver = {
    Query : {
        user: async (root, {id}) => {
            let us = await Users.findById(id);
            if (us) {
                return us;
            } else {
                throw new AuthenticationError("Error");
            }
        },
        getmyself: async (root, args, context, info) => {
            let m = await Users.findById(context.id, {password: 0})
            if(!m) {
                let error =  await new AuthenticationError("User doesnot exists");
                throw error;
            } else {
                return m;
            }
        },
        getdevice: async (root, {id}) => {
            let device = await Devices.findOne({id: id});
            if (device) {
                return device;
            } else {
                throw new AuthenticationError("Error");
            }
        },
        getalldevices: async (root) => {
            let device = await Devices.find({});
            if (device) {
                return device;
            } else {
                throw new AuthenticationError("Error");
            }
        },
        getallusers: async (root) => {
            let users = await Users.find({});
            if (users) {
                return users;
            } else {
                throw new AuthenticationError("Error");
            }
        },
     },

     Mutation: {
         login: async (root, args, context) => {
            let user = await Users.findOne({email: args.input.email});
            if (!user) {
                throw new AuthenticationError("User not registered");
            } else {
                const Match = await bcrypt.compareSync(args.input.password, user.password);
                if (Match) {
                    /*const token = jwt.sign(
                        { id: user._id },
                        process.env.ACCESS_TOKEN_SECRET,
                    );*/
                    return user;
                } else {
                    throw new AuthenticationError("Incorrect Password");
                }
            }
        },
        register: async (root, args) => {
            console.log(args);
            let user = await Users.findOne({name: args.input.name});
            if (user) {
                throw new AuthenticationError("User already registered");
            } else {
                console.log('done 1');
                let newuser = new Users({
                    "name": args.input.name,
                    "email": args.input.email,
                    "role": "Tester",
                    "status": "waiting",
                })
                const salt = await bcrypt.genSalt();
                newuser.password = await bcrypt.hash(args.input.password, salt);
                try{
                    console.log('done 2');
                    /*const token = jwt.sign(
                        {id:newuser._id},
                        process.env.ACCESS_TOKEN_SECRET,
                    )*/
                    let user_new = await newuser.save();
                    console.log('done');
                    return user_new;
                } catch(e) {
                    throw new ApolloError("Server Error");
                }
            }
        },
        addDevice: async (root, args) => {
            let device = await Devices.findOne({"id": args.input.id});
            if (device) {
                throw new ApolloError("Device already Registered");
            } else {
                let new_device = new Devices({
                    name: args.input.name,
                    id: args.input.id,
                    version: args.input.version,
                    info: args.input.info,
                });
                try {
                    return new_device.save();
                } catch(e) {
                    throw new ApolloError("Server Error");
                }
            }
        }
     },
};

module.exports = resolver;

/* 
const resolver = {
    Query : {
        user: async (root, {_id}) => {
            let us = await Testuser.findById(_id);
            if (us) {
                return us;
            } else {
                throw new AuthenticationError("User doesnot exists");
            }
        },
        getposts: async (root, args) => {
            //let ua = id.map((i) => mongoose.Types.ObjectId(i)); {"user_id": {$in: ua}}
            let posts_user = await Posts.find({});
            if (posts_user) {
                console.log('found');
                return posts_user
            } else {
                throw new ApolloError("Server Error", 501);
            }
        },
        getme: async (root, args, context, info) => {
            let me = await Testuser.findById(context.id, {password: 0})
            if(!me) {
                let error =  await new AuthenticationError("User doesnot exists");
                console.log(error.message);
                throw error;
            } else {
                console.log(me);
                console.log('found');
                return me;
            }
        },
        getallusers: async (root, args, context, info) => {
            let allusers = await Testuser.find({}, {fname: 1, lname: 1, username: 1, avatar_file: 1});
            if(!allusers) {
                throw new ApolloError("Server Error", 501);
            } else {
                return allusers;
            }
        }
        
     },

     Mutation: {
         createuser: async (root, args, context, info) => {
            console.log(args);
            console.log('working 1');
            let user = await Testuser.findOne({username: args.input.username});
            if (user) {
                throw new AuthenticationError("Username already exists");
            } else {
                let emailcheck = await Testuser.findOne({email: args.input.email});
                if (emailcheck) {
                    throw new AuthenticationError("Email already exists");
                } else {
                    const newuser = new Testuser({
                        fname: args.input.fname,
                        lname: args.input.lname,
                        username: args.input.username,
                        email: args.input.email,
                    })
                    const salt = await bcrypt.genSalt();
                    newuser.password = await bcrypt.hash(args.input.password, salt);
                    try{
                        const token = jwt.sign(
                            {id:newuser._id},
                            process.env.ACCESS_TOKEN_SECRET,{
                                expiresIn: '21d'
                            }
                        )   
                        return {user: newuser.save(), token: token}
                    } catch(e) {
                        throw new ApolloError("Server Error", 501);
                    }
                }
            }
         },
         login: async (root, args) => {
            console.log(args);
            let user = await Testuser.findOne({username: args.input.username});
            if (!user) {
                throw new AuthenticationError("Username doesnot exists");
            } else {
                const Match = await bcrypt.compareSync(args.input.password, user.password);
                if (Match) {
                    const token = jwt.sign(
                        { id: user._id },
                        process.env.ACCESS_TOKEN_SECRET, {
                          expiresIn: '365d',
                        },
                    );
                    console.log(user._id);
                    return {token: token, id: user._id};
                } else {
                    throw new AuthenticationError("Incorrect Password");
                }
            }
        },
        register: async (root, args) => {
            console.log('working');
            console.log(args);
            let user = await Testuser.findOne({username: args.input.username});
            if (user) {
                throw new AuthenticationError("Username already exists");
            } else {
                const newuser = new Testuser({
                    fname: args.input.fname,
                    lname: args.input.lname,
                    username: args.input.username,
                    email: args.input.email,
                })
                const salt = await bcrypt.genSalt();
                newuser.password = await bcrypt.hash(args.input.password, salt);
                try{
                    const token = jwt.sign(
                        {id:newuser._id},
                        process.env.ACCESS_TOKEN_SECRET,{
                            expiresIn: '21d'
                        }
                    )
                    let user = await newuser.save()   
                    return {id: user._id, token: token}
                } catch(e) {
                    throw new ApolloError("Server Error", 501);
                }
            }
        },
        delete_account: async (root, args, context, info) => {
            let myself = await Testuser.findById(context.id);
            if (myself) {
                let check = await bcrypt.compareSync(args.input.password, myself.password);
                if (check) {
                    let remove = await Testuser.remove({_id: context.id});
                    if (remove) {
                        return 'Account deleted Sucessfully.';
                    } else {
                        throw new ApolloError("Server Error", 501);
                    }
                } else {
                    throw new AuthenticationError("Incorrect Password");
                }
            }
            throw new AuthenticationError("User does not exists.");
        },
        Update_profile: async (root, args, context, info) => {
            const id = context.id;
            const {description, dob, location, website} = args.input;
            let user = await Testuser.findByIdAndUpdate(id, 
                {
                    description: description,
                    dob: dob,
                    location: location,
                    website: website
        
                });
            if(user) {
                return user;
            }
        },
        password_update: async (root, args, context, info) => {
            const id = context.id;
            //const {password} = args.input;
            const salt = await bcrypt.genSalt();
            const password = await bcrypt.hash(args.input.password, salt); 
            let user = await Testuser.updateOne({_id: id}, {
                password: password ,
            });
            if (user) {
                return "Update Sucessful";
            } else {
                throw new ApolloError("Server Error", 501);
            }
        }
     },
};
'use strict'
const User = require('../../Modules/schema');
const {AuthenticationError, ApolloError} = require('apollo-server-express');
const Testuser = require('./../../Modules/testSchema');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const SMTP = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: "peperconnect@gmail.com",
        pass: "2017acoe0012030"
    }
});
const otpresolver = {
    Query: {
        Signupotp: async (root, args, context, info) => {
            let mailcheck = await Testuser.findOne({email: args.email});
            if (mailcheck) {
                throw new ApolloError('Email already exists.', 421);
            } else {
                let usernamecheck = await Testuser.findOne({username: args.username});
                if (usernamecheck) {
                    throw new ApolloError('Username already exists.', 421);
                } else {
                    let otp = Math.floor(1000000 + Math.random() * 9000000);
                    let mailoptions = {
                        to: args.email,
                        subject: 'OTP for E mail verification.',
                        html: "The OTP for Email verification for your<br/>Peper account is<br/><br/><h2>" + otp + "<h2/><br/><br/>This OTP is valid only for 5 minutes and would expire after the given time.<br/><br/><br/><b>This is auto generated Email.<br/>Do not reply.</b>"
                    }
                    let mailsend = await SMTP.sendMail(mailoptions);
                    if (mailsend) {
                        return {otp: otp};
                    } else {
                        throw new ApolloError('Server Error.\nPlease try again', 504);
                    }
                }
            }
        },

        forget_pass: async (root, args, context, info) => {
            let user = await Testuser.findOne({username: args.username});
            if (user) {
                let otp = Math.floor(1000000 + Math.random() * 9000000);
                let mailoptions = {
                    to: user.email,
                    subject: 'OTP for E mail verification.',
                    html: "The OTP for your<br/>Peper account is<br/><br/><h2>" + otp + "<h2/><br/><br/>This OTP is valid only for 5 minutes and would expire after the given time.<br/><br/><br/><b>This is auto generated Email.<br/>Do not reply.</b>"
                }
                let mailsend = await SMTP.sendMail(mailoptions);
                if (mailsend) {
                    return {otp: otp, id: user._id};
                } else {
                    throw new ApolloError('Server Error.\nPlease try again', 504);
                }
            } else {
                throw new ApolloError('Username does not exists.', 404);
            }
        }
    }
}

module.exports = otpresolver;
*/