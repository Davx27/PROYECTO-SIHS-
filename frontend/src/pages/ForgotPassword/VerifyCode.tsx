import { useState } from "react"; import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function VerifyCodePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  function submit(event: FormEvent) {
    event.preventDefault();
    const started = Number(sessionStorage.getItem("sihs_recovery_started") ?? 0);
    if (Date.now() - started > 120000 || code !== sessionStorage.getItem("sihs_recovery_code")) return setError("El código es incorrecto o ha expirado.");
    navigate("/reset-password");
  }
  return <form onSubmit={submit}><h2>Verificar código</h2><p>Ingrese el código enviado a su correo.</p><Input label="Código de verificación" value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" required />{error && <p className="error">{error}</p>}<Button>Verificar código</Button><p><Link to="/forgot-password">Solicitar otro código</Link></p></form>;
}
