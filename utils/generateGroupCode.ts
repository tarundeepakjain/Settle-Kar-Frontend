export function generateGroupCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++)
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

export function validateGroupCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}
