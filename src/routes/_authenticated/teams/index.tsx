import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Teams from '@/features/teams'

const teamsSearchSchema = z.object({
  filter: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/teams/')({
  validateSearch: teamsSearchSchema,
  component: Teams,
})
