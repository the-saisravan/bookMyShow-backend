import express from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from "../models/user.js";
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(express.json());

//register a new user
const register= async (req,res)=>{
    const userDetails = req.body;
    const email = userDetails.email;
    const password = userDetails.password;
    const userExists = await UserModel.findOne({email: email});
    if(userExists){
        return res.status(409).json({message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    userDetails.password = hashedPassword;
    await UserModel.create(userDetails);
    // return res.status(200).json({message: "user registered successfully"});
    return res.status(200).json({message: "user registered successfully", user: userDetails});
}
export { register };

//user login
const login =async (req,res)=>{
    const {email, password} = req.body;
    const userExists = await UserModel.findOne({email: email});
    if(!userExists){
        return res.status(404).json({message: " user doesnot exit"});
    }
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if(!isPasswordValid){
        return res.status(401).json({message: "Invalid password"});
    }
    const token = jwt.sign({id: userExists._id, role: userExists.role}, process.env.JWT_SECRET, {expiresIn: '48h'});
    return res.status(200).json({message: "user logged in successfully", token});
}
export { login };