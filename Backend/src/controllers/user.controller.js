import User from "../model/user.model.js"
import Post from "../model/posts.model.js"

import redis from "../services/redis.service.js"
import { validationResult } from "express-validator"
import * as userService from "../services/user.service.js"
import * as uploadFiles from "../middleware/post.middleware.js"

export const registerController = async function(req, res){


    const {username, email, password} = req.body

    try {

        const errors = validationResult(req)
    
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()[0].msg})
        }
        
        const user = await userService.createUser({
            username,
            email,
            password
        })
 
        delete user._doc.password

        const token =  user.generateToken();
        
        res.json({message: "User registered successfully", token: token, user})

    } catch (error) {
        console.log("Error in registerController: ", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}
export const loginController = async function(req, res){
    const {email, password , username } = req.body
    try {

        const errors = validationResult(req)
    
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()[0].msg})
        }

        const user = await userService.loginUser({
            username,
            email,
            password
        })

        delete user._doc.password
        
        const token = await user.generateToken()
        
        console.log("user logged in successfully");
        res.json({message: "User logged in successfully", token: token , user})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message || "Internal server error"})   
    }
}

export const profileController = async (req, res) => {

    try {         
        
        
        const posts = await Post.getAuthorPosts(req.user._id)
        const user = await User.findById(req.user._id).lean()
        
        res.status(200).json({message: "user data found", userData : user , posts })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
    
}


export const logoutController = async (req, res) => {
    
    const timeRemainingForToken = req.tokenData.exp * 1000 - Date.now()
    
    await redis.set(`blacklist: ${req.tokenData.token}`, true , "EX" ,Math.floor(timeRemainingForToken/1000))

    res.status(200).json({message: "User logged out successfully"})
}

export const followUnfollowController = async (req , res) => {
    try {
        const {id} = req.params
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if(id===req.user._id.toString()){
            return res.status(400).json({error : "you can't follow or unfollow your self"})
        }

        if(!userToModify || !currentUser){
            return res.status(400).json({error : "user not found"})
        }

        const isfollowing = currentUser.following.includes(id)

        if(isfollowing){
            await User.findByIdAndUpdate(id,{$pull:{followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id ,{ $pull : { following : id }})
            const userPost = await User.findById(id).lean()
            const selfData = await User.findById(req.user._id ).lean()
            //  TODO: return the id of the user as response
            res.status(200).json({message : "User unfollowed successfully" , postData : userPost , selfData})
        }else {
            await User.findByIdAndUpdate(id,{$push:{followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id ,{ $push : { following : id }})
            //  TODO: return the id of the user as response
            const userPost = await User.findById(id).lean()
            const selfData = await User.findById(req.user._id ).lean()
            res.status(200).json({message : "User followed successfully",postData : userPost , selfData})
                    
        }


    } catch (error) {
        console.log("error in followUnfollowUser ", error.message);
        res.status(500).json({error : error.message})
        
    }
}


export const editProfileController = async (req, res) => {
    
   
    let {fullName , email , username ,newPassword , currentPassword ,  bio , link} = req.body
    let profilePicture = req.file
    const userId = req.user._id

    try {
        
        let  user = await User.findById(userId)
        
        if(!user){
            return res.status(404).json({message : "user not foud"})
        }

        if((!currentPassword && newPassword) || (!newPassword && currentPassword)){
            return res.status(400).json({error : "Please provide both current password and new password"})
        }

        if(currentPassword && newPassword){

            const isMatch = await user.copmarePassword(currentPassword)

            if(!isMatch) return res.status(400).json({error : "current password is incorect"})

            if(newPassword.length < 6) return res.status(400).json({error : "Password must be at least 6 charactor long"})

            user.password = await User.hashPassword(newPassword)

        }

        if(profilePicture){
            const uploadedResponse = await uploadFiles.updateFiles(profilePicture.buffer)
            profilePicture = uploadedResponse.url
        }
        

        user.fullName = fullName || user.fullName
        user.username = username || user.username
        user.email = email || user.email
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profilePicture = profilePicture || user.profilePicture

        user = await user.save()
        delete user._doc.password
       
        res.status(200).json(user)


    } catch (error) {
        console.log("error in update User",error.message)
        res.status(500).json({error : error.message})
    }
}    



export const getSuggestedUsers = async function (req, res) {
    
    try {
        
        const userId = req.user._id
        const usersFollowedByMe = await User.findById(userId).select("following")
        // console.log(usersFollowedByMe);
        
        const users = await User.aggregate([
            {
                $match :{
                    _id: {$ne: userId}
                }
            },{
                $sample:{size:10}
            }
        ])
        
        const filteredUsers = users.filter((user)=> !usersFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0,4)

        suggestedUsers.forEach(user=>user.password=null)

        res.status(200).json(suggestedUsers)



    } catch (error) {
        console.log("error in getSuggested Users", error.message);
        res.status(500).json({ error : error.message})
    }

}