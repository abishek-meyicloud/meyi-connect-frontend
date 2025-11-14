import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import {Resources } from '@/features/resources'

const resourcesSearchSchema = z.object({
  type: z
    .enum(['all', 'connected', 'notConnected'])
    .optional()
    .catch(undefined),
  filter: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/resources/')({
  validateSearch: resourcesSearchSchema,
  component: Resources,
})
