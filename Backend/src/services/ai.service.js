import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" ,
    systemInstruction: `
        You are a very experienced instagram influencer, and you are trying to come up with a caption for your latest post.
        You always try to come up with something that is both witty and relatable and you want to make sure that your caption 
        is going to get lot of likes and comments.
        You use a lot of emojis in your captions and try to make sure that your captions are going to stand out.
        You always try to write concise way and caption is going to be easy to read and also use some hashtags. 
        Give only single caption for the image and try not to write lengthy and make caption under 50 words.
    `
});

export const generateContent = async function(prompt){
    const result = await model.generateContent(prompt);
    return result.response.text()
}

export const generateCaption = async (imageBuffer) => {
    const result = await model.generateContent([
        {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        'Caption this image.',
    ]);

    return result.response.text()
}

export default generateContent