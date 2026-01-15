import { sql } from "../config/db.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import UAParser from "ua-parser-js";
import axios from "axios";

export const gererateToken=async(user)=>
{
    const payload=
    {
         username:user.username,
         email: user.email
    }
  const accessToken=jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:'60m'})
  const refreshToken=jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:'7d'})
  return {accessToken,refreshToken}
}

export const signUp=async(req,res)=>
{
    try{
        const {fullName,userName,email,password,dob,role}=req.body;
        const existQuery=await
        sql`
        SELECT * FROM "SystemUser"
        WHERE "UserName"=userName OR "Email"=email
        `

        if(existQuery.length)
        {
            return res.status(409).json(
                
                    'user already exists'
                
            )
        }
     try{
        const createUser=await sql`
        INSERT  INTO "SystemUser" ("FullName","UserName","Email","Password","Role","DateOfBirth")
        VALUES(${fullName},${userName},${email},${password},${role},${dob})
        `

        return res.status(200).json({
            message:"user created"
        })


    }
    catch(error)
    {
        return res.status(401).json(
            {
                message:'user created error'
            }
        )
    }
}

catch(error)
{
  res.status(404).json(
    {
        message:'server error'
    }
  )
}
}

