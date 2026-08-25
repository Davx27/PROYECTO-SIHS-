import Navbar from "../../components/Navbar";
import { instructorsApi } from "../../api/instructors.api";

export default function InstructorsList() {
	const instructors = instructorsApi.list();
	return <><Navbar /><main className="page-shell"><p className="eyebrow">Formación</p><h1>Instructores</h1><p>Consulta los instructores registrados en el centro de formación.</p><div className="table-wrap"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Especialidad</th><th>Tipo de contrato</th></tr></thead><tbody>{instructors.map((instructor) => <tr key={instructor.id}><td>{instructor.nombres} {instructor.apellidos}</td><td>{instructor.correo}</td><td>{instructor.especialidad ?? "Sin especificar"}</td><td>{instructor.tipoContrato ?? "Sin especificar"}</td></tr>)}</tbody></table></div>{instructors.length === 0 && <p>No hay instructores registrados.</p>}</main></>;
}
