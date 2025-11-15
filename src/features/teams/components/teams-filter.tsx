// components/team-filters.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { Label } from "@/components/ui/label"

interface TeamFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  minUsers?: number
  onMinUsersChange: (value: number | undefined) => void
  maxUsers?: number
  onMaxUsersChange: (value: number | undefined) => void
  onClearFilters: () => void
}

export function TeamFilters({
  searchQuery,
  onSearchChange,
  minUsers,
  onMinUsersChange,
  maxUsers,
  onMaxUsersChange,
  onClearFilters,
}: TeamFiltersProps) {
  const hasActiveFilters = searchQuery || minUsers !== undefined || maxUsers !== undefined

  return (
    <>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-end gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="search">Search Teams</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Min Users */}
          <div className="w-32">
            <Label htmlFor="minUsers">Min Members</Label>
            <Input
              id="minUsers"
              type="number"
              placeholder="Min"
              value={minUsers ?? ""}
              onChange={(e) => onMinUsersChange(e.target.value ? Number(e.target.value) : undefined)}
              min={0}
              className="mt-1"
            />
          </div>

          {/* Max Users */}
          <div className="w-32">
            <Label htmlFor="maxUsers">Max Members</Label>
            <Input
              id="maxUsers"
              type="number"
              placeholder="Max"
              value={maxUsers ?? ""}
              onChange={(e) => onMaxUsersChange(e.target.value ? Number(e.target.value) : undefined)}
              min={0}
              className="mt-1"
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={onClearFilters} size="default">
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
