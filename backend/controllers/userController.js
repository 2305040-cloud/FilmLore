import { sql } from "../config/db.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import UAParser from "ua-parser-js";
import axios from "axios";
dotenv.config();

const generateToken=(user)=>
{
  const payload=
  {
    
    userName:user.userName,
    email:user.email,
    role:user.role
  }
  return jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:"60m"});
};


//-------------signUp-------------

export const signUp=async(req,res)=>
{
    try{
        const{UserName,Password,FullName,Role,DOB,Email,ProfilePicture}=req.body;
        if(!fullName|| !userName || !email || !Password)
        {
            return res.status(400).json({message:"Missing required fields"});
        }
    

    const existing=await sql`
       SELECT UserName
       FROM SystemUser
       WHERE UserName=${userName}
    `;
    if(existing.length)
    {
        return res.status(409).json({message:"user already exists!"});
    }

    const created=await sql`
     INSERT INTO SystemUser (UserName,Password,FullName,Role,DateOfBirth,Email,ProfilePicture)
     VALUES (${UserName},${Password},${FullName},${Role},${DOB},${Email},${ProfilePicture})
    `;
    const user=created[0];
    const token=generateToken(user);
    return res.status(500).json({message:"User created",
                                token,
                                user:
                                {
                                   userName:user.UserName,
                                   email:user.Email,
                                   role:user.Role
                                }
    });
}

     catch(error)
     {
        console.log("sign up error!");
        return res.status(500).json({message:"server error"});
     }
};

//------------------LogIN----------------
    export const login=async(req,res)=>
    {
        try
        {
            const {UserName,Password}=req.body;
            if(!UserName || ! Password)
            {
                return res.status(400).json({message:"Missing credentials"});
            }

            const row=await sql`
            SELECT "UserName","Email","Role"
            FROM "SystemUser"
            WHERE "UserName"=${UserName} AND "Password"=${Password}
            `;
            
            if(!row.length)
            {
                return res.status(401).json({ message:"Invalid Credentials "});
            }

            const user=row[0];

            const token=generateToken(user);

            return res.status(200).json({
                message:"Login successful",token,
                user:
                {
                    UserName:user.UserName,
                    Email:user.Email,
                    Role:user.Role
                }
            });


        }
        
        catch(error)
        {
            console.log("login error");
            return res.status(500).json({message:"server error"});
        }
    };

