import { Navigate, Routes, Route } from "react-router-dom";
import { AdminHomePage } from "../../features/admin/pages/AdminHomePage.tsx";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage.tsx";
import { HomePage } from "../../features/home/pages/HomePage.tsx";
import { LoginPage } from "../../features/auth/pages/LoginPage.tsx";
import { RegisterPage } from "../../features/auth/pages/RegisterPage.tsx";
import { AdminRoute } from "./AdminRoute.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminHomePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}