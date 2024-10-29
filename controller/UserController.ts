import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getUser = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "USer Not Found",
      });
    }

    return res.status(200).json({
      user: {
        email: user.email,
        name: user.name,
        address: user.address,
        city: user.city,
        country: user.country,
      },
      success: true,
      message: "User Details",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Getting user data",
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const {email, name, address, country, city } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      {email},
      { $set: { name, address, country, city } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        message: "No User Found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Data Updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating user data",
    });
  }
};
