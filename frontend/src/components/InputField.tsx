import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export default function InputField({ label, error, id, ...props }: InputFieldProps) {
	const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
	return <label className="field" htmlFor={fieldId}><span>{label}</span><input id={fieldId} {...props} />{error && <small className="field-error">{error}</small>}</label>;
}
