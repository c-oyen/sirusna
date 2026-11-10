export interface StrapiUser {
  user: {
    id: number
    documentId: string
    username: string
    email: string
    provider: string // local
    confirmed: boolean
    blocked: boolean
    createdAt: string // date string  ex: '2026-11-09T10:14:14.284Z',
    updatedAt: string // date string
    publishedAt: string // date string
  }
}
