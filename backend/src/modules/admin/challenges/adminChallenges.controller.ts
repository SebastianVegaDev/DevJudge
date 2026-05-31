import type { RequestHandler } from "express";
import type { AuthenticatedUser } from "../../../types/auth.types.js";
import {
    createAdminChallenge,
    deleteAdminChallenge,
    updateAdminChallenge,
} from "./adminChallenges.service.js";

function getErrorStatus(message: string) {
    if (
        message.includes("required") ||
        message.includes("Difficulty") ||
        message.includes("Slug") ||
        message.includes("Title")
    ) {
        return 400;
    }

    return 500;
}

export const createChallengeController: RequestHandler = async (req, res) => {
    try {
        const user = res.locals.user as AuthenticatedUser;

        const challenge = await createAdminChallenge(req.body, user.id!);

        res.status(201).json({
            challenge,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};

export const updateChallengeController: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id as string;

        const challenge = await updateAdminChallenge(id, req.body);

        res.json({
            challenge,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};

export const deleteChallengeController: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id as string;

        const challenge = await deleteAdminChallenge(id);

        res.json({
            message: "Challenge deleted successfully",
            challenge,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};