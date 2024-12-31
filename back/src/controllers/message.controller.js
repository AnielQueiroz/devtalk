import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Erro ao obter usuarios para barra lateral: ", error);
        return res.status(500).json({ message: "Erro ao obter usuarios para barra lateral" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ],
        });

        return res.status(200).json({ messages });
    } catch (error) {
        console.log("Erro ao obter mensagens: ", error);
        return res.status(500).json({ message: "Erro ao obter mensagens" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const myId = req.user._id;

        let imageUrl = null;
        if (image) {
            // upload image
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        };

        const newMessage = await Message({
            senderId: myId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({ newMessage });
    } catch (error) {
        console.log("Erro ao enviar mensagem: ", error);
        return res.status(500).json({ message: "Erro ao enviar mensagem" });
    }
};

export const markMessageAsRead = async (req, res) => {
    // voce
    const myId = req.user._id;

    // usuario que enviou a mensagem
    const { senderId } = req.params;

    try {
       await Message.updateMany(
        { senderId, receiverId: myId, isRead: false },
        { $set: { isRead: true } }
       );

        return res.status(200).json({ message: "Mensagems marcadas como lida" });
    } catch (error) {
        console.log("Erro ao marcar mensagens como lidas: ", error);
        return res.status(500).json({ message: "Erro ao marcar mensagens como lidas" });
    }
};

export const getUnreadMessagesCounts = async (req, res) => {
    try {
        const myId = req.user._id;

        const unreadMessagesCounts = await Message.aggregate([
            {
                $match: {
                    receiverId: myId,
                    isRead: false,
                }
            },
            {
                $group: {
                    _id: "$senderId",
                    count: { $sum: 1 }
                }
            },

        ]);

        return res.status(200).json({ unreadMessagesCounts });
    } catch (error) {
        console.log("Erro ao obter contagem de mensagens nao lidas: ", error);
        return res.status(500).json({ message: "Erro ao obter contagem de mensagens nao lidas" });
    }
}

export const getInteractedContacts = async (req, res) => {
    try {
        const userId = req.user._id;

        const interactedContacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", userId] }, "$receiverId", "$senderId"
                        ]
                    }
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 1,
                    fullName: "$user.fullName",
                    profilePic: "$user.profilePic",
                }
            }
        ]);

        return res.status(200).json(interactedContacts);
    } catch (error) {
        console.log("Erro ao obter contatos interagidos: ", error);
        return res.status(500).json({ message: "Erro ao obter contatos interagidos" });
    }
};