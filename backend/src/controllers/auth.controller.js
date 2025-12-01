import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 chars" });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    generateToken(newUser._id, res);
    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      message: "Login successfull",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic:user.profilePic
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
export const logout = (req, res) => {
  try{
      res.cookie("jwt","",{
            maxAge:0
      });
      return res.status(200).json({message:"Logged out successfully"})
  }catch(error){
      console.log("Logout error",error.message);
      res.status(400).json({message:"Server error"})
  }
};

export const updateProfile = async (req, res) => {
  try {
      const {profilePic}=req.body
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(404).json({ message: "Profile picture is required" });
    }
    const uploadResponse=await cloudinary.uploader.upload(profilePic)

    const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkAuth=(req,res)=>{
  try{
    res.status(200).json(req.user)
  }catch(error){
    console.log("Error in checkAuth",error.message)
    res.status(400).json({message:"Internal server error"})
  }
}
