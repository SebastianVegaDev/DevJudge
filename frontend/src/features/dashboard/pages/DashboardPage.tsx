import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import "./DashboardPage.css";

export function DashboardPage() {
	const { user, logout } = useAuth();

	return (
		<main className="dashboard-page">
			<section className="dashboard-card">
				<h1>Dashboard</h1>

				<p>
					Welcome, <strong>{user?.username}</strong>
				</p>

				<p>
					Role: <strong>{user?.role}</strong>
				</p>

				<div className="dashboard-actions">
					<Link to="/" className="dashboard-link">
						Home
					</Link>
          
					{user?.role === "admin" && (
						<Link to="/admin" className="dashboard-link">
							Admin panel
						</Link>
					)}
					<button type="button" onClick={() => void logout()}>
						Logout
					</button>
				</div>
			</section>
		</main>
	);
}