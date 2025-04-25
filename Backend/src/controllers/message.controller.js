import Conversation from '../model/conversation.model.js'
import Message from '../model/message.model.js'

export const sendMessageController = async (req, res) => {
    const senderId = req.user._id
    const recieverId = req.params.id
    const { message } = req.body

    let conversation = await Conversation.findOne({
        participants: [{ $all : senderId, recieverId}]
    })
    if(!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, recieverId]
        })
    }

    const newMessage = await Message.create({
        senderId,
        recieverId,
        message
    })

    if(newMessage) conversation.messages.push(newMessage._id)
    await conversation.save()

    return res.status(201).json({message: "Message sent successfully", newMessage})
    
}


export const getMessageController = async (req, res) => {
    try {
        const senderId = req.user._id
        const recieverId = req.params.id

        const conversation = await Conversation.findOne({
            participants: [{ $all : senderId, recieverId}]
        })

        if(!conversation) return res.status(200).json({message:[]})
        return res.status(200).json({messages: conversation?.messages})    

    } catch (error) {
        confirm.log(error)
        res.status(500).json({message: "Internal Server Error "})
    }
}
