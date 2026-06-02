export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeLanguage = "javascript"  | "typescript" | "sql";

export type PublicChallenge = {
    id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: ChallengeDifficulty;
    topic: string;
    language: ChallengeLanguage;
    function_name: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    solved?: boolean;
};

export type ChallengeFilters = {
    search: string;
    difficulty: ChallengeDifficulty | "";
    topic: string;
    language: ChallengeLanguage | "";
};