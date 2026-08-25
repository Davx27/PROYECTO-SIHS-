function scorePassword(password: string) {
  return [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
}

export function PasswordStrengthIndicator({ password }: { password: string }) {
  const score = scorePassword(password);
  const labels = ["", "Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
  return (
    <div className="password-strength" aria-label={password ? `Nivel de seguridad ${labels[score]}` : "Requisitos de contraseña"}>
      <div className="strength-track"><span style={{ width: `${score * 20}%` }} /></div>
    </div>
  );
}
