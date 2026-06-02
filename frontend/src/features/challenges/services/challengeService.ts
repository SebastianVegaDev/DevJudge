import { apiGet } from "../../../shared/api/apiClient.ts";
import type { 
    ChallengeFilters,
    PublicChallenge,
} from "../types/challenge.types.ts";

type ChallengesResponse = {
    challenges: PublicChallenge[];
}

function buildChallengeQuery(filters: ChallengeFilters) {
    const params = new URLSearchParams();

    if (filters.search.trim()) {
        params.set("search", filters.search.trim());
    }

    if (filters.difficulty) {
        params.set("difficulty", filters.difficulty);
    }

    if (filters.topic.trim()) {
        params.set("topic", filters.topic.trim());
    }

    if (filters.language) {
        params.set("language", filters.language);
    }

    const queryString = params.toString();

    return queryString ? `?${queryString}` : "";
}

export const challengeService = {
    async getChallenges(filters: ChallengeFilters) {
        const query = buildChallengeQuery(filters);
        const data = await apiGet<ChallengesResponse>(`/challenges${query}`);
        
        return data.challenges;
    },
};