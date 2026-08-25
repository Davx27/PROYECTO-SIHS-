import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { environmentsApi } from "../api/environments.api";
import { fichesApi } from "../api/fiches.api";
import { learningResultsApi } from "../api/learningResults.api";
import { usersApi } from "../api/users.api";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const results = useMemo(() => [
    ...fichesApi.list().filter((item) => `${item.numero} ${item.programa} ${item.nivel}`.toLowerCase().includes(query)).map((item) => ({ title: `Ficha ${item.numero}`, detail: item.programa, href: "/fiches" })),
    ...environmentsApi.list().filter((item) => `${item.numero} ${item.sede} ${item.nombre}`.toLowerCase().includes(query)).map((item) => ({ title: `Ambiente ${item.numero}`, detail: `${item.nombre} · ${item.sede}`, href: "/environments" })),
    ...usersApi.list().filter((item) => `${item.nombres} ${item.apellidos} ${item.documento} ${item.correo}`.toLowerCase().includes(query)).map((item) => ({ title: `${item.nombres} ${item.apellidos}`, detail: `${item.rol} · ${item.documento}`, href: `/users/${item.id}` })),
    ...learningResultsApi.list().filter((item) => `${item.codigo} ${item.nombre} ${item.acronimo}`.toLowerCase().includes(query)).map((item) => ({ title: item.nombre, detail: `${item.codigo} · ${item.acronimo}`, href: "/learning-results" })),
  ], [query]);
  return <><Navbar /><main className="page-shell"><p className="eyebrow">Resultados de consulta</p><h1>Resultados para “{params.get("q") ?? ""}”</h1>{!query && <p>Escribe un término en el buscador para consultar la información del sistema.</p>}{query && results.length === 0 && <p>No encontramos resultados para esta búsqueda.</p>}<div className="search-results">{results.map((result, index) => <Link className="search-result" to={result.href} key={`${result.href}-${index}`}><strong>{result.title}</strong><span>{result.detail}</span><span>Ver información →</span></Link>)}</div></main></>;
}
