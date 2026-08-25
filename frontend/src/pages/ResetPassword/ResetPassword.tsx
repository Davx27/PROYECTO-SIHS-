import { useState } from "react"; import type { FormEvent } from "react";
import {useNavigate} from "react-router-dom";
import {Input} from "../../components/ui/Input";import {Button} from "../../components/ui/Button";import {PasswordStrengthIndicator} from "../../components/common/PasswordStrengthIndicator";import {authService} from "../../services/auth.service";import {isStrongPassword} from "../../utils/validation";

export default function ResetPasswordPage(){
 const correo=sessionStorage.getItem("sihs_recovery_email")||"";const code=sessionStorage.getItem("sihs_recovery_code")||"";const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");const [error,setError]=useState("");const navigate=useNavigate();
 async function submit(e:FormEvent){e.preventDefault();if(!isStrongPassword(password))return setError("La contraseña no cumple los requisitos.");if(password!==confirm)return setError("Las contraseñas no coinciden.");try{await authService.resetPassword(correo,code,password);sessionStorage.clear();navigate("/login")}catch(e){setError(e instanceof Error?e.message:"No fue posible cambiar la contraseña.")}}
 return <form onSubmit={submit}><h2>Nueva contraseña</h2><Input label="Nueva contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><PasswordStrengthIndicator password={password}/><Input label="Confirmar contraseña" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/>{error&&<p className="error">{error}</p>}<Button>Guardar contraseña</Button></form>;
}