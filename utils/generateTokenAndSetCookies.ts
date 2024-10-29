import { Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";


const Jwt_secret = process.env.JWT_SECRET as string; // Type assertion

export const generateTokenAndSetCookies = (res:Response, userId: ObjectId, userEmail: String) => {
    const token = jwt.sign({userId}, Jwt_secret , {
        expiresIn: '7d',
    })

    res.cookie("token", token , {
        // httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, 
    });

    res.cookie("email", userEmail, {
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, 
    })

    return token;
}