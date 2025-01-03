import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import Community from "../models/community.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import User from "../models/user.model.js";
import Tag from "../models/tags.model.js";
import mongoose from "mongoose";

export const createCommunity = async (req, res) => {
    const { name, description, photoUrl, tags } = req.body;

    if (!name) return res.status(400).json({ message: "Nome é obrigatório!" });
    if (!tags || tags.length === 0) return res.status(400).json({ message: "Pelo menos uma tag é obrigatória!" });

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const newCommunity = await Community({
            name,
            description,
            photoUrl,
            tags,
            members: [
                {
                    userId: req.user._id,
                    role: "admin",
                    joinedAt: new Date()
                }
            ]
        });

        await newCommunity.save();

        // Adicionar a comunidade ao usuário
        const user = await User.findById(req.user._id).session(session);
        user.joinedCommunities.push(newCommunity._id);
        await user.save();

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ newCommunity });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log("Erro ao criar comunidade: ", error);
        return res.status(500).json({ message: "Erro ao criar comunidade" });
    }
};

export const deleteCommunity = async (req, res) => {
    const { id: communityId } = req.params; // ID da comunidade a ser excluída
    const myId = req.user._id; // ID do usuário autenticado

    const session = await mongoose.startSession(); // Inicia uma sessão MongoDB

    try {
        session.startTransaction();

        // 1. Verificar se a comunidade existe
        const community = await Community.findById(communityId).session(session);
        if (!community) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Comunidade não encontrada!" });
        }

        // 2. Verificar se o usuário tem permissão para excluir a comunidade (precisa ser administrador)
        const isAdmin = community.members.some(
            (member) => member.userId.toString() === myId.toString() && member.role === "admin"
        );

        if (!isAdmin) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Você não tem permissão para excluir esta comunidade!" });
        }

        // 3. Remover todos os membros da comunidade (opcional, dependendo do seu modelo de negócio)
        // Isso pode ser necessário para garantir que não haja dados órfãos relacionados a membros da comunidade
        community.members = [];
        await community.save();

        // 4. Remover o communityId do campo joinedCommunities de todos os usuários
        await User.updateMany(
            { joinedCommunities: communityId }, // Condição de busca: se o usuário pertence à comunidade
            { $pull: { joinedCommunities: communityId } }, // Remove o communityId da lista de comunidades
            { session } // Usa a mesma sessão da transação
        );

        // 5. Excluir todas as mensagens associadas à comunidade
        await GroupMessage.deleteMany({ communityId }).session(session);

        // 6. Excluir a comunidade
        await Community.deleteOne({ _id: communityId }).session(session);

        // 7. Commit da transação
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Comunidade excluída com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir comunidade: ", error);
        await session.abortTransaction(); // Reverte alterações em caso de erro
        session.endSession();
        return res.status(500).json({ message: "Erro ao excluir a comunidade" });
    }
};

export const sendGroupMessage = async (req, res) => {
    const { id: communityId } = req.params;
    const { text, image } = req.body;
    const myId = req.user._id;

    let imageUrl = null;

    if (!communityId) return res.status(400).json({ message: "Comunidade é obrigatória!" });

    try {
        if (image) {
            // upload image
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // salvar mensagem
        const newMessage = await GroupMessage({
            senderId: myId,
            communityId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // enviar mensagem para todos os membros da comunidade
        // const members = await User.find({ joinedCommunities: communityId});
        // for (const member of members) {
        //     const receiverSocketId = getReceiverSocketId(member._id);
        //     if (receiverSocketId) {
        //         io.to(receiverSocketId).emit("newGroupMessage", newMessage);
        //     }
        // }

        // Emitir mensagem para todos os membros conectados
        // const community = await Community.findById(communityId).populate('members.userId');
        // if (!community) {
        //     return res.status(404).json({ message: "Comunidade não encontrada!" });
        // }

        // for (const member of community.members) {
        //     const receiverSocketId = getReceiverSocketId(member.userId.toString());
        //     if (receiverSocketId) {
        //         io.to(receiverSocketId).emit('newGroupMessage', newMessage);
        //     }
        // }

        return res.status(201).json({ newMessage });
    } catch (error) {
        console.log("Erro ao enviar mensagem de grupo: ", error);
        return res.status(500).json({ message: "Erro ao enviar mensagem de grupo" });
    }
};

export const deleteGroupMessage = async (req, res) => {
    const { id: communityId, messageId } = req.params; // IDs da comunidade e mensagem
    const myId = req.user._id; // ID do usuário autenticado

    if (!communityId) return res.status(400).json({ message: "ID da comunidade é obrigatório!" });
    if (!messageId) return res.status(400).json({ message: "ID da mensagem é obrigatório!" });

    const session = await mongoose.startSession(); // Inicia uma sessão MongoDB

    try {
        session.startTransaction();

        // 1. Buscar a comunidade
        const community = await Community.findById(communityId).session(session);
        if (!community) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Comunidade não encontrada!" });
        }

        // 2. Buscar a mensagem
        const message = await GroupMessage.findById(messageId).session(session);
        if (!message) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Mensagem não encontrada!" });
        }

        // 3. Verificar se o usuário tem permissão para excluir
        // - Verifica se o usuário é o autor da mensagem ou um administrador da comunidade
        const isAuthor = message.senderId.toString() === myId.toString();
        // const isAdmin = community.admins.some(admin => admin.userId.toString() === myId.toString());
        const isAdmin = community.members.some(
            (member) => member.userId.toString() === myId.toString() && member.role === "admin"
        );
        
        if (!isAuthor && !isAdmin) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Você não tem permissão para excluir essa mensagem!" });
        }

        // 4. Excluir a mensagem
        await GroupMessage.deleteOne({ _id: messageId }).session(session);

        // 5. Commit na transação
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Mensagem excluída com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir mensagem: ", error);
        await session.abortTransaction(); // Reverte alterações em caso de erro
        session.endSession();
        return res.status(500).json({ message: "Erro ao excluir a mensagem" });
    }
};

export const getCommunityMessages = async (req, res) => {
    const { id: communityId } = req.params; // ID da comunidade
    const { page = 1, limit = 20 } = req.query; // Parâmetros de paginação

    if (!communityId) return res.status(400).json({ message: "Comunidade é obrigatória!" });

    try {
        // Validar se a comunidade existe
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Comunidade não encontrada!" });
        }

        // Buscar mensagens com paginação
        const messages = await GroupMessage.find({ communityId })
            .sort({ createdAt: -1 }) // Ordena por data decrescente (mais recente primeiro)
            .skip((page - 1) * limit) // Ignora as mensagens das páginas anteriores
            .limit(Number.parseInt(limit)) // Limita o número de mensagens por página
            .populate('senderId', 'name avatar') // Popula informações do remetente
            .lean(); // Retorna objetos JavaScript puros para melhor desempenho

        // Contar o total de mensagens para paginação
        const totalMessages = await GroupMessage.countDocuments({ communityId });

        return res.status(200).json({
            messages,
            currentPage: Number.parseInt(page),
            totalPages: Math.ceil(totalMessages / limit),
            totalMessages
        });
    } catch (error) {
        console.error("Erro ao buscar mensagens da comunidade: ", error);
        return res.status(500).json({ message: "Erro ao buscar mensagens da comunidade" });
    }
};

export const markAllAsReadForUser = async (req, res) => {
    const { id: communityId } = req.params; // ID da comunidade
    const myId = req.user._id; // ID do usuário autenticado

    if (!communityId) return res.status(400).json({ message: "Comunidade é obrigatória!" });

    try {
        // 1. Atualiza mensagens onde o usuário já existe no array isReadBy
        await GroupMessage.updateMany(
            { communityId, "isReadBy.userId": myId },
            {
                $set: {
                    "isReadBy.$.isRead": true,
                    "isReadBy.$.readAt": new Date()
                }
            }
        );

        // 2. Adiciona o usuário ao array isReadBy se ainda não existir
        await GroupMessage.updateMany(
            { 
                communityId,
                "isReadBy.userId": { $ne: myId } // Filtra onde o usuário não existe no array
            },
            {
                $push: {
                    isReadBy: {
                        userId: myId,
                        isRead: true,
                        readAt: new Date()
                    }
                }
            }
        );

        return res.status(200).json({ message: "Todas as mensagens foram marcadas como lidas" });
    } catch (error) {
        console.error("Erro ao marcar mensagens como lidas: ", error);
        return res.status(500).json({ message: "Erro ao marcar mensagens como lidas" });
    }
};

export const joinCommunity = async (req, res) => {
    const { id: communityId } = req.params;
    const myId = req.user._id;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Verificar se a comunidade existe
        const community = await Community.findById(communityId).session(session);
        if (!community) {
            return res.status(404).json({ message: "Comunidade não encontrada!" });
        }

        // Verificar se o usuário existe
        const user = await User.findById(myId).session(session);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        // Verificar se o usuário já está na comunidade (no lado do usuário)
        if (user.joinedCommunities.includes(communityId)) {
            return res.status(400).json({ message: "Você já está na comunidade!" });
        }

        // Verificar se o usuário já está na lista de membros da comunidade
        community.members.push({ userId: myId });
        await community.save({ session });

        // Adicionar a comunidade ao usuário
        user.joinedCommunities.push(communityId);
        await user.save({ session });

        // Finalizar a transação
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Você entrou na comunidade com sucesso!" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Erro ao entrar na comunidade: ", error);
        return res.status(500).json({ message: "Erro ao entrar na comunidade!", error: error.message });
    }
};

export const leaveCommunity = async (req, res) => {
    const { id: communityId } = req.params;
    const myId = req.user._id;

    if (!communityId) return res.status(400).json({ message: "ID da comunidade é obrigatório!" });

    if (!myId) return res.status(400).json({ message: "ID do usuário é obrigatório!" });

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Verificar se a comunidade existe
        const community = await Community.findById(communityId).session(session);
        if (!community) {
            return res.status(404).json({ message: "Comunidade não encontrada!" });
        }

        // 2. Verificar se o usuário existe
        const user = await User.findById(myId).session(session);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        // 3. Verificar se o usuário está na comunidade (no lado do usuário)
        const isMember = user.joinedCommunities.some(
            (id) => id.toString() === communityId
        );

        if (!isMember) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Usuário não está na comunidade!" });
        }

        // 4. Remover a comunidade do lado do usuário
        user.joinedCommunities = user.joinedCommunities.filter(
            (id) => id.toString() !== communityId
        );
        await user.save({ session });

        // 5. Remover o usuário do lado da comunidade
        community.members = community.members.filter(
            (member) => member.userId.toString() !== myId.toString()
        );      
        await community.save();

        // 6. Commit na transação
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Voce deixou a comunidade com sucesso!" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Erro ao deixar comunidade: ", error);
        return res.status(500).json({ message: "Erro ao deixar comunidade", error: error.message });
    }
};

export const getCommunityMembers = async (req, res) => {
    const { id: communityId } = req.params;

    try {
        const community = await Community.findById(communityId).populate({
            path: "members.userId",
            select: "fullName profilePic email",
        });

        if (!community) return res.status(404).json({ message: "Comunidade não encontrada!" });

        return res.status(200).json({ members: community.members });
    } catch (error) {
        console.log("Erro ao obter membros da comunidade: ", error);
        return res.status(500).json({ message: "Erro ao obter membros da comunidade" });
    }
};

export const getCommunitiesAllOrSearch = async (req, res) => {
    const { name, tagName } = req.query; // Parâmetros da query: nome da comunidade ou nome da tag

    try {
        const filter = {};

        // Se o nome da comunidade foi fornecido, filtra pelo nome
        if (name) {
            filter.name = { $regex: name, $options: "i" };  // Busca insensível a maiúsculas e minúsculas
        }

        // Se o nome da tag foi fornecido, filtra pelas tags
        if (tagName) {
            // Encontrar as tags com o nome fornecido
            const tags = await Tag.find({ name: { $regex: tagName, $options: "i" } }).select("_id");
            if (tags.length > 0) {
                // Filtra as comunidades que possuem essas tags
                filter.tags = { $in: tags.map(tag => tag._id) }; // Match pelo ID das tags
            } else {
                // Se nenhuma tag for encontrada com o nome, retorna uma lista vazia
                return res.status(404).json({ message: "Nenhuma tag encontrada com esse nome" });
            }
        }

        // Encontrar todas as comunidades que correspondem aos filtros
        const communities = await Community.find(filter).select("-members").populate("tags", "_id name");  // Popula as tags para retornar os dados completos das tags

        // Retorna as comunidades encontradas
        return res.status(200).json({ communities });
    } catch (error) {
        console.log("Erro ao buscar comunidades: ", error);
        return res.status(500).json({ message: "Erro ao buscar comunidades" });
    }
};

export const addMemberToCommunity = async (req, res) => {
    const { id: communityId } = req.params;
    const { userId, role } = req.body;

    if (!userId) return res.status(400).json({ message: "Usuário obrigatório!" });
    if (!communityId) return res.status(400).json({ message: "Comunidade obrigatória!" });

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const community = await Community.findById(communityId).session(session);
        if (!community) return res.status(404).json({ message: "Comunidade não encontrada!" });

        const user = await User.findById(userId).session(session);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado!" });

        // Verificar se o usuário já está na comunidade (no lado do usuário)
        if (user.joinedCommunities.includes(communityId)) {
            return res.status(400).json({ message: "Usuário já está na comunidade!" });
        }

        // Adicionar o usuário na lista de membros da comunidade
        community.members.push({ userId, role: role || "member" });
        await community.save({ session });

        // Adicionar a comunidade ao usuário
        user.joinedCommunities.push(communityId);
        await user.save({ session });

        // Finalizar a transação
        await session.commitTransaction();
        session.endSession();        

        return res.status(200).json({ message: "Usuário adicionado a comunidade com sucesso!" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log("Erro ao adicionar usuário a comunidade: ", error);
        return res.status(500).json({ message: "Erro ao adicionar usuário a comunidade", error: error.message });
    }
};

export const removeMemberFromCommunity = async (req, res) => {
    const { id: communityId } = req.params; // ID da comunidade
    const { userId } = req.body; // ID do usuário a ser removido

    const session = await mongoose.startSession(); // Inicia uma sessão MongoDB

    try {
        session.startTransaction();

        // 1. Buscar a comunidade
        const community = await Community.findById(communityId).session(session);
        if (!community) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Comunidade não encontrada!" });
        }

        // 2. Buscar o usuário
        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        // 3. Verificar se o usuário está na comunidade
        const isMember = community.members.some(
            (member) => member.userId.toString() === userId
        );
        if (!isMember) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Usuário não é membro da comunidade!" });
        }

        // 4. Remover o usuário do array `members` na comunidade
        community.members = community.members.filter(
            (member) => member.userId.toString() !== userId
        );
        await community.save({ session });

        // 5. Remover a comunidade do array `joinedCommunities` no usuário
        user.joinedCommunities = user.joinedCommunities.filter(
            (id) => id.toString() !== communityId
        );
        await user.save({ session });

        // 6. Commit na transação
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Usuário removido da comunidade com sucesso!" });
    } catch (error) {
        console.error("Erro ao remover usuário da comunidade: ", error);
        await session.abortTransaction(); // Reverte alterações
        session.endSession();
        return res.status(500).json({ message: "Erro ao remover usuário da comunidade" });
    }
};
