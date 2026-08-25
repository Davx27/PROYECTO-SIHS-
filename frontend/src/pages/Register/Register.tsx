import { useState } from "react"; import type { FormEvent } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { PasswordStrengthIndicator } from "../../components/common/PasswordStrengthIndicator";
import { authService } from "../../services/auth.service"; import type { RegisterRequest } from "../../services/auth.service";
import { isStrongPassword } from "../../utils/validation";
import type { Role } from "../../types/auth";

export default function RegisterPage(){
 const [role,setRole]=useState<Role>("APRENDIZ"); const [form,setForm]=useState<Record<string,string>>({});
 const [error,setError]=useState(""); const navigate=useNavigate();
 const set=(key:string)=>(e:React.ChangeEvent<HTMLInputElement>)=>setForm(f=>({...f,[key]:e.target.value}));
 async function submit(e:FormEvent){e.preventDefault();setError("");
  if(!isStrongPassword(form.password||""))return setError("La contraseña no cumple todos los requisitos.");
  if(form.password!==form.confirmPassword)return setError("Las contraseñas no coinciden.");
  const payload:RegisterRequest={nombres:form.nombres||"",apellidos:form.apellidos||"",documento:form.documento||"",tipoDocumento:form.tipoDocumento||"CC",correo:form.correo||"",telefono:form.telefono||"",password:form.password,rol:role};
  if(role==="INSTRUCTOR")Object.assign(payload,{codigoInstructor:form.codigoInstructor,especialidad:form.especialidad});
  if(role==="APRENDIZ")Object.assign(payload,{codigoFicha:form.codigoFicha,programaFormacion:form.programaFormacion});
  try{await authService.register(payload);navigate("/login")}catch(e){setError(e instanceof Error?e.message:"No fue posible registrar.");}
 }
 return <form onSubmit={submit}><h2>Crear cuenta</h2>
  <Select label="Tipo de usuario" value={role} onChange={e=>setRole(e.target.value as Role)} options={[{value:"COORDINADOR",label:"Coordinador"},{value:"INSTRUCTOR",label:"Instructor"},{value:"APRENDIZ",label:"Aprendiz"}]}/>
  <div className="grid-2">
   <Input label="Nombres" value={form.nombres||""} onChange={set("nombres")} required/><Input label="Apellidos" value={form.apellidos||""} onChange={set("apellidos")} required/>
   <Input label="Número de documento" value={form.documento||""} onChange={set("documento")} required/>
   <Select label="Tipo de documento" value={form.tipoDocumento||"CC"} onChange={e=>setForm(f=>({...f,tipoDocumento:e.target.value}))} options={[{value:"CC",label:"Cédula de ciudadanía"},{value:"TI",label:"Tarjeta de identidad"},{value:"CE",label:"Cédula de extranjería"}]}/>
   <Input label="Correo electrónico" type="email" value={form.correo||""} onChange={set("correo")} required/><Input label="Teléfono" value={form.telefono||""} onChange={set("telefono")} required/>
   {role==="INSTRUCTOR"&&<><Input label="Código de instructor" value={form.codigoInstructor||""} onChange={set("codigoInstructor")} required/><Input label="Especialidad" value={form.especialidad||""} onChange={set("especialidad")} required/></>}
   {role==="APRENDIZ"&&<><Input label="Código de ficha" value={form.codigoFicha||""} onChange={set("codigoFicha")} required/><Input label="Programa de formación" value={form.programaFormacion||""} onChange={set("programaFormacion")} required/></>}
   <Input label="Contraseña" type="password" value={form.password||""} onChange={set("password")} required/><Input label="Confirmar contraseña" type="password" value={form.confirmPassword||""} onChange={set("confirmPassword")} required/>
  </div>
  <PasswordStrengthIndicator password={form.password||""}/>{error&&<p className="error">{error}</p>}<Button>Registrarme</Button><p><Link to="/login">Volver al inicio de sesión</Link></p>
 </form>;
}