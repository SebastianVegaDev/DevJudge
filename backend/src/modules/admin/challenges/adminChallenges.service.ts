import type { ChallengeInput } from "../../../types/admin.types.js";
import { validateChallengeInput } from "../../../validators/admin.validators.js";
import { deleteChallengeById, insertChallenge, updateChallengeById } from "./adminChallenges.repository.js";

export async function createAdminChallenge(input: ChallengeInput, createdBy: string) {
    validateChallengeInput(input);
    
    return insertChallenge(input, createdBy);
}

export async function updateAdminChallenge(id: string, input: ChallengeInput) {
    validateChallengeInput(input);

    const challenge = await updateChallengeById(id, input);

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