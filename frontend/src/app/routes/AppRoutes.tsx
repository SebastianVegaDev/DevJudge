import { Navigate, Routes, Route } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout.tsx"
import { AdminHomePage } from "../../features/admin/pages/AdminHomePage.tsx";
import { LoginPage } from "../../features/auth/pages/LoginPage.tsx";
import { RegisterPage } from "../../features/auth/pages/RegisterPage.tsx";
import { ChallengesPage } from "../../features/challenges/pages/ChallengesPage.tsx";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage.tsx";
import { HomePage } from "../../features/home/pages/HomePage.tsx";
import { AdminRoute } from "./AdminRoute.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
				<Route element={<AppLayout />}>
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/challenges" element={<ChallengesPage />} />
				</Route>
            </Route>
            <Route element={<AdminRoute />}>
				<Route element={<AppLayout />}>
                    <Route path="/admin" element={<AdminHomePage />} />
				</Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}