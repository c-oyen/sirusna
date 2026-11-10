// Next.js proxy.ts (middleware.ts before Next 16)
import { NextResponse, type NextRequest } from "next/server"
import { getIronSession, nextProxyCookies } from "iron-session"
import { SessionData, sessionOptions } from "./lib/session/config"

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  const session = await getIronSession<SessionData>(
    nextProxyCookies(req, res),
    sessionOptions
  )
  session.lastSeen = Date.now()
  await session.save()

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: ["/administrasi/:path*"],
}
