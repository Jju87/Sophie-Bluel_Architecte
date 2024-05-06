const db = require('./../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = db.users;
require('dotenv').config();

exports.signup = async (req, res) => {
    if(!req.body.email || !req.body.password){
        return res.status(400).send({
            message: "Must have email and password"
        });
    }
    try{
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = new Users({
            email: req.body.email,
            password: hash
        });
        await user.save();
        return res.status(201).json({message: 'User Created'})
    }catch (err){
        return res.status(500).send({
            message: err.message
        });
    }

}

exports.login = async (req, res) => {
    console.log('Attempting to login with email:', req.body.email);
    const user = await Users.findOne({email: req.body.email});
    console.log('User found:', user);
    if(user === null){
        console.log('No user found with email:', req.body.email);
        return res.status(401).json({message: 'Auth failed'});
    }	
    try{
        console.log('Comparing passwords...');
        if(req.body.password === user.password){
            console.log('Passwords match. Generating token...');
            const token = jwt.sign(
                {email: user.email, userId: user._id},
                process.env.JWT_KEY,
                {expiresIn: "1h"}
            );
            console.log('Token generated:', token);
            return res.status(200).json({message: 'Auth successful', token: token});
        } else {
            console.log('Passwords do not match.');
            return res.status(401).json({message: 'Auth failed'});
        }
    }catch(err){
        console.log('An error occurred:', err);
        return res.status(500).json({error: err});
    }
}