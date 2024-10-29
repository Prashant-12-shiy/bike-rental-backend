import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "../mailtrap/email";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies";

const signup = async (req: Request, res: Response): Promise<any> => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All field are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({
        message: "User Already Exists",
        success: "false",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 9000000); //generate a 6-digit verification code
    console.log(hashedPassword);
    console.log(verificationToken);
    console.log(password);

    const user = new User({
      email,
      password: hashedPassword,
      name: name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 Hours
    });

    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({
      success: true,
      message:
        "User registered successfully. Please check your email for verification.",
      user: {
        email: user.email,
        name: user.name,
        verificationToken: user.verificationToken,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error while signUp" });
    return;
  }
};

const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired Verification code",
      });
    }

    if (user) {
      (user.isVerified = true),
        (user.verificationToken = undefined),
        (user.verificationTokenExpiresAt = undefined);

      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Email Verified",
      user: {
        email: user?.email,
        name: user?.name,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Error while Verifying Email" });
  }
};

const login = async (req: Request, res: Response):Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not Found",
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    generateTokenAndSetCookies(res, user._id, user.email);

    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Error while Verifying Email" });
  }
};

const logout = async (req: Request,res: Response):Promise<any> => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successfully" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Error while Logout" });
  }
}

export default {
  signup,
  verifyEmail,
  login,
  logout
};
