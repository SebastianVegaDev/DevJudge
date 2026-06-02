import type { ChallengeLanguage } from "./challenge.types.js";

export const submissionStatus = [
    "pending",
    "running",
    "accepted",
    "wrong_answer",
    "runtime_error",
    "time_limit_error",
    "compilation_error",
] as const;

export type SubmissionStatus = (typeof submissionStatus)[number];

export type CreateSubmissionInput = {
    code: string;
};

export type Submission = {
    id: string;
    user_id: string;
    challenge_id: string;
    language: ChallengeLanguage;
    code: string;
    status: SubmissionStatus;
    passed_tests: number;
    total_tests: number;
    score: number;
    runtime_ms: number | null;
    error_message: string | null;
    created_at: string;
};
