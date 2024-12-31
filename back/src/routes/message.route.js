import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSideBar, sendMessage, getInteractedContacts, markMessageAsRead, getUnreadMessagesCounts } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSideBar);
router.get("/interacted-contacts", protectRoute, getInteractedContacts);
router.get("/unread-messages-count", protectRoute, getUnreadMessagesCounts);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.put("/mark-as-read/:senderId", protectRoute, markMessageAsRead);

export default router;