"use server"

import * as z from "zod"
import { redirect } from "next/navigation"
import { loginStrapi } from "@/lib/strapi"
import { getSession } from "@/lib/session"
import { StrapiUser } from "@/types/user"

const loginFormSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
})

// Define the state type that useActionState expects
export type LoginState = {
  errors?: {
    email?: string[]
    password?: string[]
    global?: string
  }
}

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("authFormLoginEmail") as string
  const password = formData.get("authFormLoginPassword") as string

  const validatedFields = loginFormSchema.safeParse({ email, password })

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    }
  }

  const result = await loginStrapi({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  const { jwt: authJWT, user: authUser }: { jwt: string; user: StrapiUser } =
    result.data

  if (!result.success) {
    const errorMessage = result.error?.message || "Kredensial tidak cocok."
    return {
      errors: {
        global:
          errorMessage === "Invalid identifier or password"
            ? "Email atau password tidak valid"
            : errorMessage,
      },
    }
  }
  const session = await getSession()
  session.jwt = authJWT
  session.user = authUser
  session.isLoggedIn = true
  await session.save()
  redirect("/administrasi")
}
