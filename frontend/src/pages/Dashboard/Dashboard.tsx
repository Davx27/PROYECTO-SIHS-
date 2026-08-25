import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { authService } from "../../services/auth.service";
import CoordinatorDashboard from "./CoordinatorDashboard";
import InstructorDashboard from "./InstructorDashboard";
import LearnerDashboard from "./LearnerDashboard";

export default function DashboardPage() {
	const user = authService.currentUser();
	if (user?.rol === "COORDINADOR") return <CoordinatorDashboard />;
	if (user?.rol === "INSTRUCTOR") return <InstructorDashboard />;
	if (user?.rol === "APRENDIZ") return <LearnerDashboard />;
	return <><Navbar /><main className="page-shell"><p className="eyebrow">Sistema Integrado de Horarios SENA</p><h1>Hola, {user?.nombres}</h1><p>Consulta y gestiona la programación de tu centro de formación.</p><div className="dashboard-grid"><Link to="/schedules">Horarios</Link><Link to="/fiches">Fichas</Link><Link to="/learning-results">Resultados de aprendizaje</Link><Link to="/environments">Ambientes</Link></div></main></>;
}
    