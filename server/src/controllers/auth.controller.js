import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};




export const registerUser  = async(req,res)=>{
    try{
        const {name,email,password} = req.body

        if(!name || ! email || !password){
            return res.status(400).json({message:"All the fields are required."})
        }

        const existingtUser = await User.findOne({email})

        if(existingtUser){
            return res.status(400).json({message:"user already exists."})
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });


        return res.status(201).json({message:"User Registered successfully.",user})


    }

    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})
    }
}

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;


    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile from Google");
    }

    const payload = await response.json();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        authProvider: 'google'
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
      await user.save();
    }

    const jwtToken = generateToken(user._id);

    return res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({ message: "Invalid Google Token" });
  }
};




export const loginUser = async(req,res)=>{
    try{

        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({message:"All the field required."})
        }

        const user  = await User.findOne({email})



        if(!user){
            return res.status(400).json({message:"User not found."})
        }

        if(!user.password) {
            return res.status(400).json({message:"Please login using Google Auth."})
        }



        const compare = await bcrypt.compare(password,user.password)

        if(!compare){
            return res.status(400).json({message:"Invalid credentials."})
        }


        const token = generateToken(user._id)

        return res.status(200).json({message:"Logged In successfully",token,user})


    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})

    }
}