// TeamDeleteDialog.tsx

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  
  interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onDelete: () => void
    teamName: string
  }
  
  export function TeamDeleteDialog({ open, onOpenChange, onDelete, teamName }: Props) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the team <strong>{teamName}</strong>?  
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
  
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              onDelete()
              onOpenChange(false)
            }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  