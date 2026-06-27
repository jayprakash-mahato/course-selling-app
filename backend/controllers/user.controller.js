import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const signup = async (req, res) => {
   const { firstName, lastName, email, password } = req.body;

   const userSchema = z.object({
      firstName: z.string().min(2, { message: "firstName must be atleast 2 cahr long" }),
      lastName: z.string().min(2, { message: "lastName must be atleast 2 cahr long" }),
      email: z.string().min(2).max(50),
      password: z.string().min(6, { message: "password must be atleast 6 cahr long" }),
   })

   const validateData = userSchema.safeParse(req.body);
   if (!validateData.success) {
      return res.status(400).json({ errors: validateData.error.issues.map(err => err.message) })
   }

   // const hashPassword = await bcrypt.hash(password, 10)


   try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
         return res.status(400).json({ errors: "User Already Exists" })
      }

      const newUser = new User({ firstName, lastName, email, password, });
      await newUser.save();
      res.status(201).json({ message: "Signup Succeeeded", newUser });


   } catch (error) {

      res.status(500).json({ errors: "Error in Signup" })
      console.log("Error in Signup", error);
   }
}

export const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email: email });
      const isPasswordCorrect = await (password, user.password)
      // const isPasswordCorrect = await bcrypt.compare(password, user.password)

      if (!user || !isPasswordCorrect) {
         return res.status(403).json({ errors: "invalid credentials" });
      }

      // JWT CODE 

      const token = jwt.sign({
         id: user._id,

      }, config.JWT_USER_PASSWORD, { expiresIn: "1d" });

      const cookieOptions = {
         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "Strict",
      };

      
      res.cookie("jwt", token, cookieOptions);
      
      res.status(201).json({ message: "Login Successful", user, token });
   } catch (error) {
      res.status(500).json({ errors: "Error in Login" });
      console.log("error in login", error);
   }
}


export const logout = (req, res) => {
   try {

      res.clearCookie("jwt");
      res.status(200).json({ message: "Logged out Successfully" });
   } catch (error) {
      res.status(500).json({ errors: "Error in Logout" });
      console.log("Error in Logout", error)
   }
}


export const purchases = async (req, res) => {
   const userId = req.userId;

   try {
      const purchased = await Purchase.find({ userId })

      let purchasedCourseId = [];

      for (let i = 0; i < purchased.length; i++) {
         purchasedCourseId.push(purchased[i].courseId)

      }
      const courseData = await Course.find({
         _id: { $in: purchasedCourseId },
      });
      res.status(200).json({ purchased, courseData });
   } catch (error) {
      res.status(500).json({ errors: "Error in Purchases" });
      console.log("Error in Purchase", error);
   }
};