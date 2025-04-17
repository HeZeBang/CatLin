// types/next-auth.d.ts
import { UserType } from "@/models/user"
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & UserType
  }

  interface User extends DefaultUser {
    id: string
    role?: string
  }

  interface JWT {
    id: string
    role?: string
  }
}
