import { pool } from "../../config/db.js";
import type { AuthenticatedUser } from "../../types/auth.types.js";
import type { ChallengeLanguage } from "../../types/challenge.types.js";
import type { Submission } from "../../types/submission.types.js";

type PublishedChallengeForSubmission = {
    id: string;
    language: ChallengeLanguage;
};

type InsertSubmissionInput = {
    userId: string;
    challengeId: string;
    language: ChallengeLanguage;
    code: string;
    totalTests: number;
}

const submissionSelect = `
    SELECT
        id,
        user_id,
        challenge_id,
        language,
        source_code AS code,
        status,
        passed_tests,
        total_tests,
        score,
        runtime_ms,
        error_message,
        created_at
    FROM submissions
`;

export async function findPublishedChallengeForSubmission(challengeId: string): Promise<PublishedChallengeForSubmission | null> {
    const { rows } = await pool.query(`
        SELECT id, language
        FROM challenges
        WHERE id = $1 AND is_published = true;
    `, [challengeId]);

    return rows[0] ?? null;
}

export async function countChallengeTestCases(challengeId: string) {
    const { rows } = await pool.query<{ total: string }>(`
        SELECT COUNT(*) AS total
        FROM test_cases
        WHERE challenge_id = $1;
    `, [challengeId]);

    return Number(rows[0]?.total ?? 0);
}

export async function insertSubmission(input: InsertSubmissionInput) {
    const { rows } = await pool.query<Submission>(`
        INSERT INTO submissions (
            user_id,
            challenge_id,
            language,
            source_code,
            status,
            passed_tests,
            total_tests,
            score,
            runtime_ms,
            error_message
        )
        VALUES ($1, $2, $3, $4, 'pending', 0, $5, 0, NULL, NULL)
        RETURNING
            id,
            user_id,
            challenge_id,
            language,
            source_code AS code,
            status,
            passed_tests,
            total_tests,
            score,
            runtime_ms,
            error_message,
            created_at;
    `, [
        input.userId,
        input.challengeId,
        input.language,
        input.code,
        input.totalTests,
    ]);

    return rows[0];
}

export async function findMySubmissionsByChallenge(challengeId: string, userId: string) {
    const { rows } = await pool.query(`
        ${submissionSelect}
        WHERE challenge_id = $1 AND user_id = $2
        ORDER BY created_at DESC;
    `, [challengeId, userId]);

    return rows;
}

export async function findSubmissionByIdForUser(submissionId: string, user: AuthenticatedUser) {
    const values = [submissionId];
    let ownerCondition = "";

    if (user.role !== "admin") {
        values.push(user.id);
        ownerCondition = `AND user_id = $${values.length}`;
    }

    const { rows } = await pool.query(`
        ${submissionSelect}
        WHERE id = $1 ${ownerCondition};
    `, values);

    return rows[0] ?? null;
}