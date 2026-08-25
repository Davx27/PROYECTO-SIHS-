import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Login/Login";
import RegisterPage from "../pages/Register/Register";
import ForgotPasswordPage from "../pages/ForgotPassword/ForgotPassword";
import VerifyCodePage from "../pages/ForgotPassword/VerifyCode";
import ResetPasswordPage from "../pages/ResetPassword/ResetPassword";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardPage from "../pages/Dashboard/Dashboard";
import EnvironmentsList from "../pages/Environments/EnvironmentsList";
import CreateEnvironment from "../pages/Environments/CreateEnvironment";
import EditEnvironment from "../pages/Environments/EditEnvironment";
import FichesList from "../pages/Fiches/FichesList";
import CreateFiche from "../pages/Fiches/CreateFiche";
import EditFiche from "../pages/Fiches/EditFiche";
import LearningResultsList from "../pages/LearningResults/LearningResultsList";
import CreateLearningResult from "../pages/LearningResults/CreateLearningResult";
import EditLearningResult from "../pages/LearningResults/EditLearningResult";
import ScheduleList from "../pages/Schedules/ScheduleList";
import CreateSchedule from "../pages/Schedules/CreateSchedule";
import EditSchedule from "../pages/Schedules/EditSchedule";
import UsersList from "../pages/Users/UsersList";
import EditUser from "../pages/Users/EditUser";
import InstructorCode from "../pages/Instructors/InstructorCode";
import InstructorsList from "../pages/Instructors/InstructorsList";
import RegisterRole from "../pages/Register/RegisterRole";
import UserDetail from "../pages/Users/UserDetail";
import SearchResults from "../pages/SearchResults";

export default function AppRouter() {
	return <Routes>
		<Route path="/login" element={<LoginPage />} />
		<Route path="/register" element={<RegisterPage />} />
		<Route path="/register/role" element={<RegisterRole />} />
		<Route path="/forgot-password" element={<ForgotPasswordPage />} />
		<Route path="/verify-code" element={<VerifyCodePage />} />
		<Route path="/reset-password" element={<ResetPasswordPage />} />
		<Route element={<ProtectedRoute />}><Route path="/search" element={<SearchResults />} /></Route>
		<Route element={<ProtectedRoute />}><Route path="/dashboard" element={<DashboardPage />} /></Route>
		<Route element={<ProtectedRoute allowedRoles={["COORDINADOR", "INSTRUCTOR", "APRENDIZ"]} />}><Route path="/environments" element={<EnvironmentsList />} /><Route path="/instructors" element={<InstructorsList />} /></Route>
		<Route element={<ProtectedRoute allowedRoles={["COORDINADOR"]} />}><Route path="/environments/new" element={<CreateEnvironment />} /><Route path="/environments/:id/edit" element={<EditEnvironment />} /></Route>
		<Route element={<ProtectedRoute allowedRoles={["COORDINADOR", "INSTRUCTOR", "APRENDIZ"]} />}><Route path="/fiches" element={<FichesList />} /></Route>
		<Route element={<ProtectedRoute allowedRoles={["COORDINADOR", "INSTRUCTOR", "APRENDIZ"]} />}><Route path="/learning-results" element={<LearningResultsList />} /></Route>
		<Route element={<ProtectedRoute allowedRoles={["COORDINADOR"]} />}><Route path="/fiches/new" element={<CreateFiche />} /><Route path="/fiches/:id/edit" element={<EditFiche />} /><Route path="/learning-results/new" element={<CreateLearningResult />} /><Route path="/learning-results/:id/edit" element={<EditLearningResult />} /></Route>
		<Route element={<ProtectedRoute allowedRoles={["COORDINADOR", "INSTRUCTOR", "APRENDIZ"]} />}><Route path="/schedules" element={<ScheduleList />} /></Route>
		<Route element={<ProtectedRoute allowedRoles={["COORDINADOR"]} />}><Route path="/schedules/new" element={<CreateSchedule />} /><Route path="/schedules/:id/edit" element={<EditSchedule />} /><Route path="/users" element={<UsersList />} /><Route path="/users/:id" element={<UserDetail />} /><Route path="/users/:id/edit" element={<EditUser />} /><Route path="/instructors/code" element={<InstructorCode />} /></Route>
		<Route path="*" element={<Navigate to="/login" replace />} />
	</Routes>;
}

