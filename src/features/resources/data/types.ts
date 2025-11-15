// types/resource.ts
export type ResourceType = 'database' | 'api' | 'storage' | 'messaging'

export interface Resource {
  id: string
  name: string
  type: ResourceType
  host?: string
  port?: number
  credentials?: Record<string, any>
  team_id?: string
  owner_id?: string
  logo?: React.ReactNode
  desc: string
  created_at: string
}

export interface Team {
  id: string
  name: string
  description?: string
}

export interface User {
  id: string
  name: string
  email: string
}
