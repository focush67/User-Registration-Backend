import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/User.js";
import {config} from "dotenv";
config();
const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    const {email,password} = req.body;
    try{
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(401).json({
            message:`User doesn't exist for Email: ${email}`
        });
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(405).json({
            message:`Invalid Login Credentials for ${user.email}`
        })
    }
    const token = jwt.sign({
        id: user._id
    },process.env.JWT_SECRET, {expiresIn: "1h"});

    res.status(200).json({
        message:`Session Created Successfully`,
        token: token
    })
    }catch(error){
        console.error(`Error inside /login POST : ${error}`);
        return res.status(500).json({
            message:"Some error occured while logging in"
        })
    }
})


authRouter.post("/signup",async(req,res) => {
    const {email,password} = req.body;
    console.log({email,password})
    if(!email){
        res.status(400).json({
            message:`Missing Credentials for Signup : Email`
        })
    }
    if(!password){
        res.status(400).json({
            message:`Missing Credentials for Signup : Password`
        })
    }
    try{
        const user = await User.findOne({
            email: email
        })
        if(user){
            res.status(409).json({
                message: `User already exists. Please login`
            })
        }
        const hashedPass = await bcrypt.hash(password,10)
        const newUser = await User.create({
            email,
            password: hashedPass,

        })
        await newUser.save();
        return res.status(201).json({
            message:`User successfully registered. Proceed to login.`
        })
    }catch(error){
        console.log(`Error inside /signup POST ${error}`);
        res.status(500).json({
            message:`Some error occured while registering`
        })
        process.exit(1)
    }
})


export default authRouter;