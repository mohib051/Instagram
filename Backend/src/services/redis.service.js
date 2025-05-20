import Redis from "ioredis";
import config from "../config/config.js";


const redis = new Redis({
    host : 'redis-14433.c263.us-east-1-2.ec2.redns.redis-cloud.com',
    port : '14433',
    password : 'DJu20uWYKKR9hg4fcaMkvxbk77OWyLa5'
});


redis.on('connect', () => {
    console.log('Redis connected');
});


export default redis;