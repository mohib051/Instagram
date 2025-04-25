import userModel from "../model/user.model.js";

export const createUser = async function ({ username, email, password  }) {
  
        if(!username || !email || !password) {
            throw new Error("All fields are required");
        }


        const alreadyExist  = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if(alreadyExist){
            throw new Error("User already exists");
        }

        const hashedPassword = await userModel.hashedPassword(password);

        const newUser = new userModel({
            username,
            email,
            password : hashedPassword
        });

        await newUser.save();

        return newUser



}

export const loginUser = async function({email, username, password}){
    if(!email && !username) {
        throw new Error("Username or Password required")
    }

    if(!password){
        throw new Error("Password is required")
    }

    const user = await userModel.findOne({
        $or: [{ username }, { email }]
    }).select("+password")
    
    if(!user){
        throw new Error("username or password is incorrect")
    }

    const isMatch = await user.verifyPassword(password)
    
    if(!isMatch){
        throw new Error("username or password is incorrect")
    }

    delete user._doc.password

    return user
} 