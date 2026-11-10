import "server-only"

const API_URL = process.env.STRAPI_API_URL

export type StrapiError = {
  status: number
  name: string
  message: string
  details: Record<string, unknown>
}

export const loginStrapi = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  try {
    const res = await fetch(`${API_URL}/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    })

    const data = await res.json()

    // Menangani status HTTP yang bukan 2xx
    if (!res.ok) {
      return {
        success: false,
        error: data.error as StrapiError, // Ekstrak error object
      }
    }
    return {
      success: true,
      data: data,
    }
  } catch (err) {
    // Menangani error jaringan (misal: server down, timeout)
    return {
      success: false,
      error: {
        status: 500,
        name: "NetworkError",
        message: "Gagal terhubung ke server. Periksa koneksi Anda.",
        details: {},
      } as StrapiError,
    }
  }
}
