import type { User, UserInput, UserListResult } from '../types/user'

const API_URL = import.meta.env.VITE_API_URL ?? ''
const DEFAULT_ERROR_MESSAGE = 'Não foi possível concluir a operação.'

export type UserFilters = {
  name: string
  role: User['role'] | ''
}

type GetUsersParams = {
  page: number
  limit: number
  filters: UserFilters
  signal: AbortSignal
}

const getErrorMessage = async (response: Response) => {
  try {
    const body = (await response.json()) as { message?: string }
    return body.message ?? DEFAULT_ERROR_MESSAGE
  } catch {
    return DEFAULT_ERROR_MESSAGE
  }
}


export const getUsers = async ({ page, limit, filters, signal }: GetUsersParams) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (filters.name) {
    query.set('name', filters.name)
  }

  if (filters.role) {
    query.set('role', filters.role)
  }

  const response = await fetch(`${API_URL}/users?${query}`, { signal })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return (await response.json()) as UserListResult
}

export const upsertUser = async (input: UserInput) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }
}

export const removeUser = async (userId: User['id']) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }
}
