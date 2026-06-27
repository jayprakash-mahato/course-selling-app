
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import { Admin } from "../models/admin.model.js";


export const signup = async (req, res) => {
   const { firstName, lastName, email, password } = req.body;

   const adminSchema = z.object({
      firstName: z.string().min(2, { message: "firstName must be atleast 2 cahr long" }),
      lastName: z.string().min(2, { message: "lastName must be atleast 2 cahr long" }),
      email: z.string().min(2).max(50),
      password: z.string().min(2, { message: "password must be atleast 6 cahr long" }),
   })

   const validateData = adminSchema.safeParse(req.body);
   if (!validateData.success) {
      return res.status(400).json({ errors: validateData.error.issues.map(err => err.message) })
   }

   // const hashPassword = await bcrypt.hash(password, 10)


   try {
      const existingAdmin = await Admin.findOne({ email: email });
      if (existingAdmin) {
         return res.status(400).json({ errors: "Admin Already Exists" })
      }

      const newAdmin = new Admin({ firstName, lastName, email, password});
      await newAdmin.save();
      res.status(201).json({ message: "Signup Succeeeded", newAdmin });


   } catch (error) {

      res.status(500).json({ errors: "Error in Signup" })
      console.log("Error in Signup", error);
   }
}

export const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const admin = await Admin.findOne({ email: email });
      const isPasswordCorrect = await (password, admin.password)

      if (!admin || !isPasswordCorrect) {
         return res.status(403).json({ errors: "invalid credentials" });
      }

      // JWT CODE 

      const token = jwt.sign({
         id: admin._id,

      }, config.JWT_ADMIN_PASSWORD, { expiresIn: "1d" });

      const cookieOption = {
         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "Strict"
      }
      res.cookie("jwt", token, cookieOption);
      res.status(201).json({ message: "Login Successful", admin, token });
   } catch (error) {
      res.status(500).json({ errors: "Error in Login" });
      console.log("error in login", error);
   }
}


export const logout = (req, res) => {
   try {

      if(!req.cookies.jwt){
         return res.status(401).json({errors:"Kindly Login First"});
      }

      res.clearCookie("jwt");
      res.status(200).json({ message: "Logged out Successfully" });
   } catch (error) {
      res.status(500).json({ errors: "Error in Logout" });
      console.log("Error in Logout", error)
   }
}