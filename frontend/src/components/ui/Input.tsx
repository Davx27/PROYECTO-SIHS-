import { useState } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const [visible, setVisible] = useState(false);
  const isPassword = props.type === "password";
  return (
    <label className="field" htmlFor={inputId}>
      <span>{label}</span>
      <span className={isPassword ? "password-input" : undefined}>
        <input id={inputId} {...props} type={isPassword && visible ? "text" : props.type} />
        {isPassword && <button type="button" className="password-toggle" onClick={() => setVisible(!visible)} aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}>{visible ? "Ocultar" : "Mostrar"}</button>}
      </span>
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
