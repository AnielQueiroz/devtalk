import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { joinCommunity, requestToJoinCommunity, leaveCommunity, createCommunity, deleteCommunity, getCommunitiesThatIBelong, getCommunitiesAllOrSearch, addMemberToCommunity, getCommunityMembers, removeMemberFromCommunity, sendGroupMessage, markAllAsReadForUser, getCommunityMessages, deleteGroupMessage } from "../controllers/community.controller.js";

const router = express.Router();

// Rota para criar uma comunidade
router.post("/create", protectRoute, createCommunity);

// Rota para deletar uma comunidade
router.delete("/delete/:id", protectRoute, deleteCommunity);

// Rota para buscar comunidades filtradas
router.get("/search", protectRoute, getCommunitiesAllOrSearch);

// Rota para listar comunidades na qual o usuário está
router.get("/my-communities", protectRoute, getCommunitiesThatIBelong);

// Rota para listar membros de uma comunidade
router.get("/members/:id", protectRoute, getCommunityMembers);

// Rota para enviar uma mensagem para uma comunidade
router.post("/send-message/:id", protectRoute, sendGroupMessage);

// Rota para apagar uma mensagem de uma comunidade
router.delete("/:id/delete-message/:messageId", protectRoute, deleteGroupMessage);

// Rota para obter mensagens de uma comunidade
router.get("/:id/messages", protectRoute, getCommunityMessages);

// Rota para marcar mensagens de uma comunidade como lidas
router.post("/mark-all-as-read/:id", protectRoute, markAllAsReadForUser);

// Rota para adicionar um membro a uma comunidade
router.post("/add-member/:id", protectRoute, addMemberToCommunity);

// Rota para remover um membro de uma comunidade
router.post("/remove-member/:id", protectRoute, removeMemberFromCommunity);

// Rota para entrar em uma comunidade
router.post("/join/:id", protectRoute, joinCommunity);

// Rota para solicitar para entrar em uma comunidade
router.post("/join-request/:id", protectRoute, requestToJoinCommunity);

// Rota para sair de uma comunidade
router.post("/leave/:id", protectRoute, leaveCommunity);

export default router;