// components/resource-action-dialog.tsx
import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Resource, ResourceType, Team } from '../data/types'

interface ResourceFormData {
  name: string
  type: ResourceType
  desc: string
  host?: string
  port?: number
  team_id?: string
}

interface ResourceActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentResource?: Resource
  teams: Team[]
  onSubmitResource: (data: Partial<Resource>) => void
}

export const ResourceActionDialog: React.FC<ResourceActionDialogProps> = ({
  open,
  onOpenChange,
  currentResource,
  teams,
  onSubmitResource,
}) => {
  const isEdit: boolean = !!currentResource

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResourceFormData>({
    defaultValues: {
      name: '',
      type: 'api',
      desc: '',
      host: '',
      port: undefined,
      team_id: undefined,
    },
  })

  const selectedType = watch('type')
  const selectedTeamId = watch('team_id')

  useEffect(() => {
    if (open) {
      if (currentResource) {
        reset({
          name: currentResource.name,
          type: currentResource.type,
          desc: currentResource.desc,
          host: currentResource.host || '',
          port: currentResource.port,
          team_id: currentResource.team_id,
        })
      } else {
        reset({
          name: '',
          type: 'api',
          desc: '',
          host: '',
          port: undefined,
          team_id: undefined,
        })
      }
    }
  }, [open, currentResource, reset])

  const onSubmit: SubmitHandler<ResourceFormData> = (data) => {
    const submitData: Partial<Resource> = {
      name: data.name,
      type: data.type,
      desc: data.desc,
      host: data.host || undefined,
      port: data.port || undefined,
      team_id: data.team_id || undefined,
    }
    onSubmitResource(submitData)
    onOpenChange(false)
  }

  const showHostPort: boolean = selectedType === 'database' || selectedType === 'api'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the resource information below.'
              : 'Fill in the details to create a new resource.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Resource Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="e.g., Production Database"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type">Resource Type *</Label>
            <Select
              value={selectedType}
              onValueChange={(value: string) => setValue('type', value as ResourceType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="messaging">Messaging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="desc">Description *</Label>
            <Textarea
              id="desc"
              {...register('desc', { required: 'Description is required' })}
              placeholder="Describe this resource..."
              rows={3}
            />
            {errors.desc && (
              <p className="text-sm text-destructive mt-1">{errors.desc.message}</p>
            )}
          </div>

          {/* Host & Port (conditional) */}
          {showHostPort && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  {...register('host')}
                  placeholder="e.g., localhost"
                />
              </div>

              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  {...register('port', {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Port must be positive' },
                    max: { value: 65535, message: 'Port must be <= 65535' },
                  })}
                  placeholder="e.g., 5432"
                />
                {errors.port && (
                  <p className="text-sm text-destructive mt-1">{errors.port.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Team Assignment */}
          <div>
            <Label htmlFor="team_id">Assign to Team (Optional)</Label>
            <Select
              value={selectedTeamId || 'none'}
              onValueChange={(value: string) =>
                setValue('team_id', value === 'none' ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Team</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
