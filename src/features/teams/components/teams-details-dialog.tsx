// components/team-details-dialog.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Team } from "../data/data"
  import { UserAvatar } from "./user-avatar"
  import { User } from "../data/data"
  import { Separator } from "@/components/ui/separator"
  import { Users } from "lucide-react"
  
  interface TeamDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    team?: Team
    users: User[]
  }
  
  export function TeamDetailsDialog({
    open,
    onOpenChange,
    team,
    users,
  }: TeamDetailsDialogProps) {
    if (!team) return null
  
    const teamUsers = team.users
      .map((id) => users.find((u) => u.id === id))
      .filter(Boolean) as User[]
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{team.name}</DialogTitle>
            <DialogDescription>Complete team information and member list</DialogDescription>
          </DialogHeader>
  
          <div className="space-y-6">
            {/* Team Info */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="text-sm">{team.description}</p>
            </div>
  
            <Separator />
  
            {/* Team Stats */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Users className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-sm font-medium">{teamUsers.length} Members</p>
                  <p className="text-xs text-muted-foreground">Total team size</p>
                </div>
              </div>
            </div>
  
            <Separator />
  
            {/* Members List */}
            <div>
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Users size={16} />
                Team Members
              </h3>
              
              {teamUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No members in this team yet.</p>
              ) : (
                <div className="space-y-2">
                  {teamUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <UserAvatar name={user.name} size="md" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  