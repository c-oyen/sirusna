import { StrapiUser } from "@/types/user"

interface SessionData {
  user?: StrapiUser
  jwt?: string
  isLoggedIn: boolean
  lastSeen?: number
}

const sessionOptions = {
  password: process.env.SESSION_SECRET as string, // MUST be at least 32 characters
  cookieName: "sirusna_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  },
}

export { sessionOptions, type SessionData }
