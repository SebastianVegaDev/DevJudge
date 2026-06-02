import type { AuthenticatedUser } from "../../types/auth.types.js";
import { validateId } from "../../validators/challenge.validators.js";
import { validateSubmissionInput } from "../../validators/submission.validators.js";
import { 
    countChallengeTestCases,
    findMySubmissionsByChallenge,
    findPublishedChallengeForSubmission,
    findSubmissionByIdForUser,
    insertSubmission,
} from "./submissions.repository.js";

export async function createSubmission(challengeId: string, payload: unknown, user: AuthenticatedUser) {
    validateId(challengeId, "Challenge");

    const input = validateSubmissionInput(payload);
    const challenge = await findPublishedChallengeForSubmission(challengeId);

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    const totalTests = await countChallengeTestCases(challengeId);

    return insertSubmission({
        userId: user.id,
        challengeId: challenge.id,
        language: challenge.language,
        code: input.code,
        totalTests,
    });
}

export async function listMySubmissions(challengeId: string, userId: string) {
    validateId(challengeId, "Challenge");

    const challenge = await findPublishedChallengeForSubmission(challengeId);

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    return findMySubmissionsByChallenge(challenge.id, userId);
}

export async function getSubmissionById(submissionId: string, user: AuthenticatedUser) {
    validateId(submissionId, "Submission");

    const submission = await findSubmissionByIdForUser(submissionId, user);

    if (!submission) {
        throw new Error("Submission not found");
    }

    return submission;
}
