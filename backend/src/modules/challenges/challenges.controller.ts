import type { RequestHandler } from "express";
import {
    getPublishedChallengeBySlug,
    getPublishedChallenges,
} from "./challenges.service.js";

function getErrorStatus(message: string) {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes("not found")) {
        return 404;
    }

    if (
        normalizedMessage.includes("required") ||
        normalizedMessage.includes("must")
    ) {
        return 400;
    }

    return 500;
}

export const listChallengesController: RequestHandler = async (req, res) => {
    try {
        const challenges = await getPublishedChallenges(
            req.query as Record<string, unknown>
        );

        res.json({
            challenges,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        res.status(getErrorStatus(message)).json({
            message,
        });
    }
};

export const getChallengeBySlugController: RequestHandler = async (req, res) => {
    try {
        const slug = req.params.slug;

        if (Array.isArray(slug) || !slug?.trim()) {
            throw new Error("Challenge slug is required");
        }

        const challenge = await getPublishedChallengeBySlug(slug);

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