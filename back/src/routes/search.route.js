import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { searchUsersOrCommunities } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/:searchKeys", protectRoute, searchUsersOrCommunities);

export default router;