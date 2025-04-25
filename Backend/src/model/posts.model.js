import mongoose from 'mongoose'
import Comment from './comment.model.js';

const postsSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    media :{
        type: Object,
        required: true
    },
    caption : {
        type: String,
        required: true
    },
    likes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default : [0]
        }
    ],
    comments : [
        {
         
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            
        }    
    ]
}, { timestamps: true })


postsSchema.statics.getAuthorPosts = async function (authorId) {
    if (!authorId) {
        throw new Error("Author is required");
    }

    const posts = await this.find({ user: authorId })
        .sort({ createdAt: -1 })
        .populate({
            path: "comments",
            populate: { path: "author", select: "username, profilePicture" }, // Populates comment author details
        });

        console.log(posts);
        

    return posts;
};


postsSchema.methods.updateCaption = async function(caption){

    this.caption = caption
    await this.save()

    return this
}

// postsSchema.statics.getRecentPosts = function(limit){
//     if(!limit){
//         throw new Error("limit is required")
//     }

//     const posts = await this.find().sort({createdAt : -1}).limit(limit)

//     return posts
// }


const postModel = mongoose.model('Post', postsSchema)

export default postModel