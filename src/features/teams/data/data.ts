// teams-data.tsx
import { v4 as uuid } from "uuid"

export type User = {
  id: string
  name: string
  email:string
}

export type Team = {
  id: string
  name: string
  description: string
  users: string[] // user IDs
}

export const dummyUsers: User[] = [
  { id: uuid(), name: "John Doe", email: "john.doe@example.com" },
  { id: uuid(), name: "Jane Smith", email: "jane.smith@example.com" },
  { id: uuid(), name: "Robert Johnson", email: "robert.johnson@example.com" },
  { id: uuid(), name: "Emily Davis", email: "emily.davis@example.com" },
]

export const dummyTeams: Team[] = [
  {
    id: uuid(),
    name: "Engineering",
    description: "Handles all software development tasks.",
    users: [dummyUsers[0].id, dummyUsers[1].id],
  },
  {
    id: uuid(),
    name: "Marketing",
    description: "Creates marketing strategies and content.",
    users: [dummyUsers[2].id],
  },
  {
    id: uuid(),
    name: "Support",
    description: "Manages customer queries and support tickets.",
    users: [],
  },
]
