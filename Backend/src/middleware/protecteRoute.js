import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import config from "../config/config.js";
import redis from '../services/redis.service.js';

export const protecteRoute = async (req, res, next) => {
    try {
           
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const decoded = await User.verifyToken(token)

        const isTokenBlockListed = await redis.get(`blacklist: ${token}`)

        if(isTokenBlockListed){
            return res.status(401).json({ message: "Unauthorized: Invalid token" });   
        }
        let user = await redis.get(`user : ${decoded.id}`)
        if(user){
            user = JSON.parse(user)
        }
        if (!user) {
            user = await User.findById(decoded.id)
            if(user){
                delete user._doc.password
                await redis.set(`user : ${decoded.id}`, JSON.stringify(user))
            }else{
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }    
        }
        
        req.user = user;
        req.tokenData = {token , ...decoded}
        next();

    } catch (error) {
        console.error("JWT Verification Error:", error.message);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }

        res.status(500).json({ message: "Server Error" });
    }
};


