import { pool } from "../../../config/db.js";
import type { ChallengeInput } from "../../../types/admin.types.js";

export async function insertChallenge(input: ChallengeInput, createdBy: string) {
    const { rows } = await pool.query(`
        INSERT INTO challenges (
            title,
            slug,
            description,
            difficulty,
            starter_code,
            is_published,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, title, slug, description, difficulty, starter_code, is_published, created_by, created_at;
    `, [
        input.title,
        input.slug,
        input.description,
        input.difficulty,
        input.starter_code,
        input.is_published ?? false,
        createdBy,
    ])

    return rows[0];
}

export async function updateChallengeById(id: string, input: ChallengeInput) {
    const { rows } = await pool.query(`
        UPDATE challenges
        SET
            title = $1,
            slug = $2,
            description = $3,
            difficulty = $4,
            starter_code = $5,
            is_published = $6
        WHERE id = $7
        RETURNING id, title, slug, description, difficulty, starter_code, is_published, created_by, created_at;
    `, [
        input.title,
        input.slug,
        input.description,
        input.difficulty,
        input.starter_code,
        input.is_published ?? false,
        id,
    ]);

    return rows[0];
}

export async function deleteChallengeById(id: string) {
    const { rows } = await pool.query(`
        DELETE FROM challenges
        WHERE id = $1
        RETURNING id, title, slug;
    `, [id]);

    return rows[0];
}