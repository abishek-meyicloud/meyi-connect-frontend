// TeamsActionDialog.tsx
'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select" // You must install or create this
import { Team, User } from "../data/data"

const formSchema = z.object({
  name: z.string().min(1, "Team name is required."),
  description: z.string().optional(),
  users: z.array(z.string()).optional(),
})

export type TeamForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTeam?: Team
  users: User[]
  onSubmitTeam: (team: TeamForm) => void
}

export function TeamsActionDialog({
  open,
  onOpenChange,
  currentTeam,
  users,
  onSubmitTeam,
}: Props) {
  const isEdit = !!currentTeam

  const form = useForm<TeamForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentTeam || {
      name: "",
      description: "",
      users: [],
    },
  })

  const submitHandler = (values: TeamForm) => {
    onSubmitTeam(values)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(state) => {
      form.reset(currentTeam || { name: "", description: "", users: [] })
      onOpenChange(state)
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? "Edit Team" : "Add New Team"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the team details." : "Create a new team."}
          </DialogDescription>
        </DialogHeader>

        <div className="h-[22rem] overflow-y-auto pe-3 py-1">
          <Form {...form}>
            <form id="team-form" onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 px-0.5">

              {/* TEAM NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the team..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* USERS MULTI-SELECT */}
              <FormField
                control={form.control}
                name="users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Users</FormLabel>
                    <FormControl>
                      <MultiSelect
                        selected={field.value ?? []}
                        options={users.map((u) => ({ label: u.name, value: u.id }))}
                        onChange={(values) => field.onChange(values)}
                        placeholder="Select users..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type="submit" form="team-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
