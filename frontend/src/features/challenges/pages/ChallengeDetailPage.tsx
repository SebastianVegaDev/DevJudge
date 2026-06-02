import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../../shared/ui/Badge/Badge.tsx";
import { Button } from "../../../shared/ui/Button/Button.tsx";
import { Card } from "../../../shared/ui/Card/Card.tsx";
import { EmptyState } from "../../../shared/ui/EmptyState/EmptyState.tsx";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState.tsx";
import { LoadingState } from "../../../shared/ui/LoadingState/LoadingState.tsx";
import { challengeService } from "../services/challengeService.ts";
import type { PublicChallengeDetail } from "../types/challenge.types.ts";
import "./ChallengesPage.css";

type LocalAttempt = {
	id: string;
	status: "pending";
	code: string;
	createdAt: string;
	passedTests: number;
	totalTests: number;
	message: string;
};

function createAttemptId() {
	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ChallengeDetailPage() {
    const { slug } = useParams();

	const [challenge, setChallenge] = useState<PublicChallengeDetail | null>(null);
	const [code, setCode] = useState("");
	const [attempts, setAttempts] = useState<LocalAttempt[]>([]);
	const [currentResult, setCurrentResult] = useState<LocalAttempt | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!slug) {
			setError("Challenge slug is required");
			setIsLoading(false);
			return;
		}

		let isActive = true;

		async function loadChallenge() {
			setIsLoading(true);
			setError("");

			try {
				const data = await challengeService.getChallengeBySlug(slug);

				if (isActive) {
					setChallenge(data);
					setCode(data.starter_code);
					setAttempts([]);
					setCurrentResult(null);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Could not load challenge";

				if (isActive) {
					setError(message);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		}

		void loadChallenge();

		return () => {
			isActive = false;
		};
	}, [slug]);

    function handleResetCode() {
        if (!challenge) {
            return;
        }

        setCode(challenge.starter_code);
    }
    function handleRunTests() {
        if (!challenge) {
            return;
        }

        const nextAttempt: LocalAttempt = {
            id: createAttemptId(),
            status: "pending",
            code,
            createdAt: new Date().toLocaleString(),
            passedTests: 0,
            totalTests: 0,
            message: "submission created as pending. Real backend submissions and judge logic start later.",
        };

        setCurrentResult(nextAttempt);
        setAttempts((currentAttempts) => [nextAttempt, ...currentAttempts]);
    }

    if (isLoading) {
        return <LoadingState message="Loading Challenge..." />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }
    
    if (!challenge) {
        return (
            <Card>
                <EmptyState 
                    title="challenge not found"
                    description="Go back to the challenges list and choose another challenge."
                />
            </Card>
        );
    }

    return (
        <div className="challenge-detail-page">
            <div className="challenge-detail-header">
                <div>
                    <h1>{challenge.title}</h1>
                    <p>/{challenge.slug}</p>
                </div>

                <Link className="challenge-detail-link" to="/challenges">
                    Back to challenges
                </Link>
            </div>

            <Card>
                <div className="challenge-detail-meta">
                    <Badge>{challenge.difficulty}</Badge>
                    <Badge>{challenge.topic}</Badge>
                    <Badge>{challenge.language}</Badge>
                    <Badge>fn: {challenge.function_name}</Badge>
                </div>

                <p className="challenge-detail-description">{challenge.description}</p>
            </Card>

			<div className="challenge-detail-grid">
				<Card>
					<h2>Starter code</h2>
					<pre className="challenge-code-box">{challenge.starter_code}</pre>
				</Card>

				<Card>
					<h2>Your solution</h2>

					<textarea
						className="challenge-code-editor"
						value={code}
						onChange={(event) => setCode(event.target.value)}
						spellCheck={false}
					/>

					<div className="challenge-detail-actions">
						<Button onClick={handleRunTests} disabled={!code.trim()}>
							Run tests
						</Button>

						<Button variant="secondary" onClick={handleResetCode}>
							Reset code
						</Button>
					</div>
				</Card>
			</div>

            <Card>
                <h2>Result panel</h2>

                {currentResult ? (
                    <div className="challenge-result-box">
                        <div className="challenge-detail-meta">
                            <Badge>{currentResult.status}</Badge>
                            <Badge>{currentResult.passedTests}/{currentResult.totalTests} tests</Badge>
                        </div>

                        <p>{currentResult.message}</p>
                    </div>
                ) : (
                    <EmptyState
                        title="No result yet"
                        description="Click Run tests to crete a pending fake attempt for now."
                    />
                )}
            </Card>

            <Card>
                <h2>Attempt history</h2>

                {attempts.length === 0 && (
					<EmptyState
						title="No attempts yet"
						description="Your local pending attempts will appear here."
					/>
                )}

                {attempts.length > 0 && (
                    <div className="challenge-attempt-list">
                        {attempts.map((attempt, index) => (
                            <article key={attempt.id} className="challenge-attempt-item">
                                <div className="challenge-attempt-header">
                                    <strong>Attempt #{attempts.length - index}</strong>
                                    <Badge>{attempt.status}</Badge>
                                </div>

                                <p className="challenge-detail-muted">{attempt.createdAt}</p>
                                <pre className="challenge-code-box">{attempt.code}</pre>
                            </article>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )

}