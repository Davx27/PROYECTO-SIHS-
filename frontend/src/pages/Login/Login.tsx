import { useState } from "react"; import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PasswordStrengthIndicator } from "../../components/common/PasswordStrengthIndicator";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [documento,setDocumento]=useState(""); const [password,setPassword]=useState("");
  const [attempts,setAttempts]=useState(0); const [error,setError]=useState("");
  const {login,loading}=useAuth(); const navigate=useNavigate();

  async function submit(e:FormEvent) {
    e.preventDefault();
    if(attempts>=3){setError("Usuario bloqueado después de 3 intentos.");return;}
    try{await login({documento,password});navigate("/dashboard");}
    catch{const n=attempts+1;setAttempts(n);setError(n>=3?"Usuario bloqueado después de 3 intentos.":"Algún dato ingresado es erróneo, por favor verifíquelo.");}
  }
  return <form onSubmit={submit}>
    <h2>Iniciar sesión</h2>
    <Input label="Número de documento" value={documento} onChange={e=>setDocumento(e.target.value)} required />
    <Input label="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
    <PasswordStrengthIndicator password={password} />
    {error&&<p className="error">{error}</p>}
    <Button disabled={loading||attempts>=3}>{loading?"Ingresando...":"Ingresar"}</Button>
    <div className="links"><Link to="/register">Registrarme</Link><Link to="/forgot-password">¿Olvidó su contraseña?</Link></div>
  </form>;
}