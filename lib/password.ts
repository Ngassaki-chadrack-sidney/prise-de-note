import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
