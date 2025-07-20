import express from "express";
import { User } from "../model/user.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetch_user from "../middleware/fetch_user.js";


const router = express.Router();

//Route 1: Register
router.post(
  "/register",
  [
    body("username", "Enter the username").isLength({ min: 5 }),
    body("email", "Enter the email").isEmail(),
    body("password", "Enter the password").isLength({ min: 7 }),
  ],
  async (req, res) => {
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: result.array() });
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exists." });
    }
    const uniqueUsername = await User.findOne({ username: req.body.username });
    if (uniqueUsername) {
      return res
        .status(409)
        .json({
          success,
          errors: "Username already exist.Try another Username",
        });
    }
    //securing password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    //creating a user in mongodb
    try {
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPass,
      });
      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);
      success = true;
      return res.status(200).json({ success, errors: result.array() });
    } catch (error) {
      console.log(error.message);
    }
  }
);

//Route 2: login
router.post(
  "/login",
  [
    //express validator
    body("email", "Enter a valid email address").isEmail(),
    body("password", "Enter the password").isLength({ min: 7 }).exists(),
  ],
  async (req, res) => {
    let success = false;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: result.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!email)
        return res.status(400).json({ success, error: "Wrong Credentials" });
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare)
        return res.status(400).json({ success, error: "Wrong Credentials" });

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);
      success = true;
      return res.status(200).json({ success, errors: result.array(),token });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({errors:result.array()});
    }
  }
);
 
//ROUTE 3: get the logged in user details 
router.post("/getUser",fetch_user,async (req,res)=>{
  try {
    const userId=req.user.id;
      const user=await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
      res.status(500).json({errors:error.array()});
  }
}) 
export default router;
