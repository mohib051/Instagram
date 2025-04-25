import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already exists'],
        minLength: [3, 'Username must be at least 3 characters long'],
        maxLength: [15, 'Username must be at most 20 characters long'],
        trim: true,
        lowercase : true
    },
    fullName :{
        type : String,
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        minLength: [3, 'Email must be at least 3 characters long'],
        maxLength: [40, 'Email must be at most 50 characters long'],
        trim: true,
        lowercase : true
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters long'],
        select : false  

    },
    profilePicture: { 
        type: String,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
    },
    posts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    followers: [
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default : [0]
        }
    ],
    following: [
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default : [0]
        }
    ],
    bio : {
        type: String,
        default: '',
    },
    link: {
        type: String,
        default: '',
    },
    bookmark : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }]

}, { timestamps: true })


userSchema.methods.generateToken = function() {
    return jwt.sign({ 
        id: this._id , 
        username : this.username, 
        email : this.email 
    }, config.JWT_SECRET , { expiresIn : config.JWT_EXPAIRE_IN })
}

userSchema.methods.verifyPassword = async function(password) {

    if(!password) {
        throw new Error('Password is required')
    }
    
    if(!this.password) {
        throw new Error('Password is required')
    }

    return await bcrypt.compare(password, this.password)
}

userSchema.statics.verifyToken = async function(token) {
    if(!token) {
        throw new Error('Token is required')
    }
    
    return await jwt.verify(token, config.JWT_SECRET)
}

userSchema.statics.hashedPassword = async function(password) {
    if(!password) {
        throw new Error('Password is required')
    }

    return await bcrypt.hash(password, 10)
}


const userModel = mongoose.model('User', userSchema)
export default userModel