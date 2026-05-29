import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // Estendendo o tipo User
  interface User extends DefaultUser {
    role?: string;
  }

  // Estendendo o tipo Session
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  // Estendendo o JWT
  interface JWT {
    role?: string;
  }
}
