import { useParams } from "react-router-dom";
import CreateEnvironment from "./CreateEnvironment";

export default function EditEnvironment() {
	const { id } = useParams();
	if (!id) return <CreateEnvironment />;
	return <CreateEnvironment />;
}
