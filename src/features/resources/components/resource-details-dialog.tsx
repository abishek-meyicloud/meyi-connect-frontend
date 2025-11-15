// components/resource-details-dialog.tsx
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Resource, Team } from '../data/types'
import { Separator } from '@/components/ui/separator'
import { Database, Server, HardDrive, MessageSquare, Calendar, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ResourceDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource?: Resource
  teams: Team[]
}

export const ResourceDetailsDialog: React.FC<ResourceDetailsDialogProps> = ({
  open,
  onOpenChange,
  resource,
  teams,
}) => {
  if (!resource) return null

  const team = teams.find((t) => t.id === resource.team_id)

  const getTypeIcon = (type: string): React.ReactNode => {
    switch (type) {
      case 'database':
        return <Database size={18} className="text-blue-500" />
      case 'api':
        return <Server size={18} className="text-green-500" />
      case 'storage':
        return <HardDrive size={18} className="text-purple-500" />
      case 'messaging':
        return <MessageSquare size={18} className="text-orange-500" />
      default:
        return <Server size={18} />
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-muted flex size-12 items-center justify-center rounded-lg p-2">
              {resource.logo}
            </div>
            <div>
              <DialogTitle className="text-2xl">{resource.name}</DialogTitle>
              <DialogDescription>Resource details and configuration</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
            <p className="text-sm">{resource.desc}</p>
          </div>

          <Separator />

          {/* Resource Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                {getTypeIcon(resource.type)}
                Type
              </h3>
              <Badge variant="secondary" className="capitalize">
                {resource.type}
              </Badge>
            </div>

            {resource.host && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Host</h3>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {resource.host}
                </p>
              </div>
            )}

            {resource.port && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Port</h3>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
                  {resource.port}
                </p>
              </div>
            )}

            {team && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Team</h3>
                <Badge variant="outline">{team.name}</Badge>
              </div>
            )}

            {resource.owner_id && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Owner ID</h3>
                <p className="text-sm font-mono text-muted-foreground">{resource.owner_id}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Created
              </h3>
              <p className="text-sm">{formatDate(resource.created_at)}</p>
            </div>
          </div>

          {resource.credentials && Object.keys(resource.credentials).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Shield size={16} />
                  Credentials
                </h3>
                <div className="bg-muted p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Shield size={14} />
                    Credentials are encrypted and stored securely
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Keys stored: {Object.keys(resource.credentials).length}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Connection String (for databases) */}
          {resource.type === 'database' && resource.host && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Connection Information
                </h3>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs break-all">
                  {resource.host}:{resource.port || 5432}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
