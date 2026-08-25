import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { environmentsApi } from "../../api/environments.api";
import { authService } from "../../services/auth.service";

export default function EnvironmentsList() {
	const environments = environmentsApi.list();
	const isCoordinator = authService.currentUser()?.rol === "COORDINADOR";
	return <><Navbar /><main className="page-shell"><div className="page-heading"><div><p className="eyebrow">Formación</p><h1>Ambientes de formación</h1></div>{isCoordinator && <Link className="button" to="/environments/new">Nuevo ambiente</Link>}</div><div className="table-wrap"><table><thead><tr><th>Número</th><th>Sede</th><th>Nombre</th><th>Tipo</th><th>Estado</th>{isCoordinator && <th>Acciones</th>}</tr></thead><tbody>{environments.map((environment) => <tr key={environment.id}><td>{environment.numero}</td><td>{environment.sede}</td><td>{environment.nombre}</td><td>{environment.tipo}</td><td>{environment.estado}</td>{isCoordinator && <td><Link to={`/environments/${environment.id}/edit`}>Editar</Link></td>}</tr>)}</tbody></table></div></main></>;
}
