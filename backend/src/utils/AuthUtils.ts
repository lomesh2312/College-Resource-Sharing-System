import bcrypt from "bcrypt";

export class PasswordHasher {
  private static readonly SALT_ROUNDS = 10;

  public static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  public static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

import jwt from "jsonwebtoken";

export class JWTManager {
  private static readonly SECRET = process.env.JWT_SECRET || "default_secret_key_123";
  private static readonly EXPIRES_IN = "24h";

  public static generateToken(payload: object): string {
    return jwt.sign(payload, this.SECRET, { expiresIn: this.EXPIRES_IN });
  }

  public static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.SECRET);
    } catch (error) {
      return null;
    }
  }
}
