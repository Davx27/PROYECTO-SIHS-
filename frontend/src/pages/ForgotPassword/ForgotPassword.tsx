import { useState } from "react"; import type { FormEvent } from "react";
import {Link,useNavigate} from "react-router-dom";
import {Input} from "../../components/ui/Input"; import {Button} from "../../components/ui/Button"; import {authService} from "../../services/auth.service";

export default function ForgotPasswordPage(){
 const [correo,setCorreo]=useState("");const [error,setError]=useState("");const navigate=useNavigate();
 async function submit(e:FormEvent){e.preventDefault();try{await authService.requestRecovery(correo);sessionStorage.setItem("sihs_recovery_email",correo);sessionStorage.setItem("sihs_recovery_started",String(Date.now()));navigate("/verify-code")}catch(e){setError(e instanceof Error?e.message:"No fue posible enviar el código.")}}
 return <form onSubmit={submit}><h2>Recuperar contraseña</h2><p>Ingrese el correo asociado a su cuenta.</p><Input label="Correo electrónico" type="email" value={correo} onChange={e=>setCorreo(e.target.value)} required/>{error&&<p className="error">{error}</p>}<Button>Enviar código</Button><p><Link to="/login">Volver</Link></p></form>;
}