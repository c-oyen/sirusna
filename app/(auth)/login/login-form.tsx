"use client"

import Form from "next/form"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input" // <-- Import here
import { cn } from "cn"
import Link from "next/link"
import { loginAction, type LoginState } from "./action"

const initialState: LoginState = {}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  )

  return (
    <Form
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Masuk ke Sistem</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Silakan masukkan alamat email dan kata sandi Anda.
          </p>
        </div>

        {state.errors?.global && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
            {state.errors.global}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Alamat Email</FieldLabel>
          <Input
            id="email"
            name="authFormLoginEmail"
            autoComplete="email"
            type="email"
            placeholder="nama@instansi.go.id"
            defaultValue=""
          />
          {state.errors?.email && (
            <FieldError className="mt-1 text-sm text-destructive">
              {state.errors.email[0]}
            </FieldError>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
            <Link
              href="/forgot-password"
              tabIndex={-1}
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Lupa Kata Sandi?
            </Link>
          </div>

          {/* Replace standard Input with PasswordInput */}
          <PasswordInput
            id="password"
            name="authFormLoginPassword"
            autoComplete="current-password"
            placeholder="••••••••"
          />

          {state.errors?.password && (
            <FieldError className="mt-1 text-sm text-destructive">
              {state.errors.password[0]}
            </FieldError>
          )}
        </Field>

        <Field>
          <Button size="lg" type="submit" className="mt-2" disabled={isPending}>
            {isPending ? "Memproses..." : "Masuk"}
          </Button>
        </Field>
      </FieldGroup>
    </Form>
  )
}
