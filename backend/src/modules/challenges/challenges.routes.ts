import { Router } from "express";
import {
    getChallengeBySlugController,
    listChallengesController,
} from "./challenges.controller.js";

const router = Router();

router.get("/", listChallengesController);
router.get("/:slug", getChallengeBySlugController);

export default router;