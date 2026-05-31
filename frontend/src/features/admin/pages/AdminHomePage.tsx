import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import "./AdminHomePage.css";

export function AdminHomePage() {
	const { user } = useAuth();

	return (
		<main className="admin-home-page">
			<section className="admin-home-card">
				<h1>Admin panel</h1>

				<p>
					Hello, <strong>{user?.username}</strong>
				</p>

				<p>From here you will manage DevJudge content.</p>

				<div className="admin-home-grid">
					<article className="admin-home-box">
						<h2>Challenges</h2>
						<p>Create and manage coding challenges.</p>
					</article>

					<article className="admin-home-box">
						<h2>Test cases</h2>
						<p>Manage visible and hidden tests.</p>
					</article>

					<article className="admin-home-box">
						<h2>Users</h2>
						<p>Future user and role tools.</p>
					</article>
				</div>

				<Link to="/dashboard" className="admin-home-link">
					Back to dashboard
				</Link>
			</section>
		</main>
	);
}