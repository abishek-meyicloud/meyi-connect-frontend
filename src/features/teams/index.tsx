// TeamsPage.tsx
"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Pencil, Trash, Users, Eye } from "lucide-react"
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Main } from "@/components/layout/main"
import { dummyTeams, dummyUsers, Team } from "./data/data"
import { TeamsActionDialog } from "./components/teams-action-dialog"
import { ConfigDrawer } from '@/components/config-drawer'
import { TeamDeleteDialog } from "./components/teams-delete-dialog"
import { TeamDetailsDialog } from "./components/teams-details-dialog"
// import { TeamFilters } from "./components/teams-filter"
import { UserAvatar } from "./components/user-avatar"
import { v4 as uuid } from "uuid"

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>(dummyTeams)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [minUsers, setMinUsers] = useState<number | undefined>(undefined)
  const [maxUsers, setMaxUsers] = useState<number | undefined>(undefined)

  // Filtered teams
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Search filter
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // User count filter
      const userCount = team.users.length
      const matchesMinUsers = minUsers === undefined || userCount >= minUsers
      const matchesMaxUsers = maxUsers === undefined || userCount <= maxUsers

      return matchesSearch && matchesMinUsers && matchesMaxUsers
    })
  }, [teams, searchQuery, minUsers, maxUsers])

  const openAdd = () => {
    setSelectedTeam(undefined)
    setDialogOpen(true)
  }

  const openEdit = (team: Team) => {
    setSelectedTeam(team)
    setDialogOpen(true)
  }

  const openDelete = (team: Team) => {
    setSelectedTeam(team)
    setDeleteOpen(true)
  }

  const openDetails = (team: Team) => {
    setSelectedTeam(team)
    setDetailsOpen(true)
  }

  const onSubmitTeam = (data: any) => {
    if (selectedTeam) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === selectedTeam.id ? { ...t, ...data } : t
        )
      )
    } else {
      setTeams((prev) => [
        ...prev,
        { id: uuid(), ...data },
      ])
    }
  }

  const onDelete = () => {
    if (!selectedTeam) return
    setTeams((prev) => prev.filter((t) => t.id !== selectedTeam.id))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setMinUsers(undefined)
    setMaxUsers(undefined)
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className="">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Teams</h1>
              <p className="text-muted-foreground">Manage your organization teams.</p>
            </div>

            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </div>

          {/* Filters */}
          {/* <TeamFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            minUsers={minUsers}
            onMinUsersChange={setMinUsers}
            maxUsers={maxUsers}
            onMaxUsersChange={setMaxUsers}
            onClearFilters={clearFilters}
          /> */}

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTeams.length} of {teams.length} teams
            </p>
          </div>

          {/* GRID */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => {
              const teamUsers = team.users
                .map((id) => dummyUsers.find((u) => u.id === id))
                .filter(Boolean)

              return (
                <Card key={team.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start ">
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg">{team.name}</h2>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Users size={14} />
                        <span>{team.users.length} members</span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(team)}
                      >
                        <Pencil size={14} />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => openDelete(team)}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground  line-clamp-2">
                    {team.description}
                  </p>
                  {/* Avatar Group */}
                  <div className="">
                    {teamUsers.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No members yet</p>
                    ) : (
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {teamUsers.slice(0, 4).map((user) => (
                            <UserAvatar
                              key={user!.id}
                              name={user!.name}
                              className="border-2 border-background"
                            />
                          ))}
                          {teamUsers.length > 4 && (
                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted border-2 border-background text-xs font-medium">
                              +{teamUsers.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openDetails(team)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Card>
              )
            })}
          </div>

          {filteredTeams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No teams found matching your filters.</p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear filters
              </Button>
            </div>
          )}

          {/* Add/Edit Dialog */}
          <TeamsActionDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            currentTeam={selectedTeam}
            users={dummyUsers}
            onSubmitTeam={onSubmitTeam}
          />

          {/* Delete Dialog */}
          <TeamDeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onDelete={onDelete}
            teamName={selectedTeam?.name || ""}
          />

          {/* Details Dialog */}
          <TeamDetailsDialog
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            team={selectedTeam}
            users={dummyUsers}
          />
        </div>
      </Main>
    </>
  )
}
