import { Card } from "../../../shared/ui/Card/Card";
import { EmptyState } from "../../../shared/ui/EmptyState/EmptyState";
import "./ChallengesPage.css";

export function ChallengesPage() {
	return (
		<div className="challenges-page">
			<Card>
				<h1>Challenges</h1>
				<p>This page will list the coding challenges.</p>
				<EmptyState
					title="No challenges loaded yet"
					description="In the next missions, this page will connect to the backend challenges API."
				/>
			</Card>
		</div>
	);
}