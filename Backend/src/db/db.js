import config from '../config/config.js';
import mongoose from 'mongoose';
// Connect to MongoDB
const Connect = ()=>{
    mongoose.connect(config.MONGO_URI)
   .then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err));
}


export default Connect;