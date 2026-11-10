import { LoginForm } from "./login-form"
import Image from "next/image"
import loginBgImg from "@/public/bg-login.jpeg"
import logoPemkab from "@/public/logo-pemkab-bangka.png"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Image
                src={logoPemkab}
                alt="logo pemerintahan kabupaten bangka"
                className="h-7 w-5"
              />
            </div>
            SIRUSNA
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <Image
          src={loginBgImg}
          alt="Login Page Featured or Background Image"
          fill
          priority
          loading="eager"
          sizes="(min-width: 808px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
