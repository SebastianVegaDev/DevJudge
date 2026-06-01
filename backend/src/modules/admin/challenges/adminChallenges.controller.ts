import type { RequestHandler } from "express";
import type { AuthenticatedUser } from "../../../types/auth.types.js";
import {
    createAdminChallenge,
    deleteAdminChallenge,
    updateAdminChallenge,
} from "./adminChallenges.service.js";

function getErrorStatus(message: string) {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes("not found")) {
        return 404;
    }

    if (normalizedMessage.includes("already exists")) {
        return 409;
    }

    if (
        normalizedMessage.includes("required") ||
        normalizedMessage.includes("must") ||
        normalizedMessage.includes("invalid") ||
        normalizedMessage.includes("use lowercase")
    ) {
        return 400;
    }

    return 500;
}

export const createChallengeController: RequestHandler = async (req, res) => {
    try {
        const user = res.locals.user as AuthenticatedUser;

        const challenge = await createAdminChallenge(req.body, user.id);

        res.status(201).json({
            challenge,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};

export const updateChallengeController: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;

        if (Array.isArray(id) || !id?.trim()) {
            throw new Error("Challenge id is required");
        }

        const challenge = await updateAdminChallenge(id, req.body);

        res.json({
            challenge,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};

export const deleteChallengeController: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id;

        if (Array.isArray(id) || !id?.trim()) {
            throw new Error("Challenge id is required");
        }

        const challenge = await deleteAdminChallenge(id);

        res.json({
            message: "Challenge deleted successfully",
            challenge,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};