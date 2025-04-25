import Post from "../model/posts.model.js"
import User from "../model/user.model.js"
import Comment from "../model/comment.model.js"
import { generateCaption } from "../services/ai.service.js"
import e from "express"



export const createController = async (req,res) => {

    try {
        const media = req.body.image.url
        const {caption} = req.body
        
        const userId = req.user._id
        if(!media) return res.status(400).json({message: "media is required"})
        if(!caption) return res.status(400).json({message: "caption is required"})
            
        const newPost = new Post({
            user: userId,
            media :{
                id : req.body.image.fileId,
                url : req.body.image.url,
                thumnailURL : req.body.image.thumbnailUrl
            } , 
            caption
        })
        await newPost.save()
        const user = await User.findOneAndUpdate({_id : req.user._id},{
            $push: {posts: newPost._id}
        })
        console.log(user);
        res.status(201).json({message: "Post Created successfully", postData: newPost})
        
    }
     catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
        
    }
}


export const likesController = async (req,res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id
        
        const post = await Post.findById(postId)
        if(!post) return res.status(404).json({message: "Post not found"})
        
        if(post.likes.includes(userId)){
            post.likes.pull(userId)
        } else {
            post.likes.push(userId)
        }
        await post.save()
        
        res.status(200).json({message: "Like updated successfully", postData: post})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
        
    }
}


export const commentController = async (req,res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id
        const {text} = req.body

        const post = await Post.findById(postId)
        if(!post) return res.status(404).json({message: "Post not found"})
        if(!text) return res.status(400).json({message: "Text is required"})
            
            
        const newComment = await Comment.create({
            text,
            author : userId,
            post : postId
        }).populate({
            path : "author",
            select : "username , profilePicture"
        })

        post.comments.push(newComment._id)
        await post.save()

        res.status(201).json({message: "Comment Created successfully", postData: post})


    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const getCommentController = async (req,res) => {
    try {
        const postId = req.params.id
        const comments = await Comment.find({post : postId}).populate({
            path : "author",
            select : "username , profilePicture"
        })
        if(!comments) return res.status(404).json({message: "Comments not found"})
        res.status(200).json({comments})
    }catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }    

}

export const deletePostController = async (req,res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id

        const post = await Post.findById(postId)
        if(!post) return res.status(404).json({message: "Post not found"})
        if(post.user.toString() !== userId.toString()) return res.status(403).json({message: "You are not authorized to delete this post"})
        
        await Post.findByIdAndDelete(postId)
        
        const user = await User.findById(userId)
        user.posts.pull(postId)
        await user.save()

        await Comment.deleteMany({post :postId})

        return res.status(200).json({message: "Post deleted successfully"})


    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
        
    }
}

export const bookmarkController = async (req,res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id

        const post = await Post.findById(postId)
        if(!post) return res.status(404).json({message: "Post not found"})
        
        const user = await User.findById(userId)
        const isBookmarked = user.bookmark.includes(postId)
        if (isBookmarked) {
            await User.findByIdAndUpdate(userId, { $pull: { bookmark: postId } });
            return res.status(200).json({ message: "Bookmark removed successfully" });
        } else {
            await User.findByIdAndUpdate(userId, { $addToSet: { bookmark: postId } });
            return res.status(200).json({ message: "Bookmark added successfully" });
        }   
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}


export const createCaption = async (req , res) => {
    const imageBuffer = req.file.buffer
    const caption = await generateCaption(imageBuffer)
    res.status(201).json({caption})
}