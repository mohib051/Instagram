import ImageKit from "imagekit";
import config from "../config/config.js";

const imagekit = new ImageKit({
    publicKey : config.IMAGEKIT_PUBLIC_KEY,
    privateKey : config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : config.IMAGEKIT_URL
});

export default imagekit