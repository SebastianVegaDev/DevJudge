import { validateChallengeInput } from "../../../validators/challenge.validators.js";
import {
    deleteChallengeById,
    insertChallenge,
    updateChallengeById,
} from "./adminChallenges.repository.js";

export async function createAdminChallenge(input: unknown, createdBy: string) {
    const validatedInput = validateChallengeInput(input);

    return insertChallenge(validatedInput, createdBy);
}

export async function updateAdminChallenge(id: string, input: unknown) {
    const validatedInput = validateChallengeInput(input);

    const challenge = await updateChallengeById(id, validatedInput);

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    return challenge;
}

export async function deleteAdminChallenge(id: string) {
    const challenge = await deleteChallengeById(id);

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    return challenge;
}