// pages/ResourcesPage.tsx
import React, { ChangeEvent, useState, useMemo } from 'react'
import { SlidersHorizontal, ArrowUpAZ, ArrowDownAZ, Plus, Pencil, Trash, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ResourceActionDialog } from './components/resource-action-dialog'
import { ResourceDeleteDialog } from './components/resource-delete-dialog'
import { ResourceDetailsDialog } from './components/resource-details-dialog'
import { dummyResources, dummyTeams } from './data/resources'
import { Resource, ResourceType } from './data/types'
import { v4 as uuid } from 'uuid'

type ResourceTypeFilter = 'all' | ResourceType
type SortOrder = 'asc' | 'desc'

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(dummyResources)
  const [sort, setSort] = useState<SortOrder>('asc')
  const [resourceType, setResourceType] = useState<ResourceTypeFilter>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false)
  const [selectedResource, setSelectedResource] = useState<Resource | undefined>(undefined)

  const filteredResources = useMemo(() => {
    return resources
      .sort((a, b) =>
        sort === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      )
      .filter((resource) =>
        resourceType === 'all' ? true : resource.type === resourceType
      )
      .filter((resource) =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.desc.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [resources, sort, resourceType, searchTerm])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }

  const handleTypeChange = (value: string): void => {
    setResourceType(value as ResourceTypeFilter)
  }

  const handleSortChange = (value: string): void => {
    setSort(value as SortOrder)
  }

  const openAdd = (): void => {
    setSelectedResource(undefined)
    setDialogOpen(true)
  }

  const openEdit = (resource: Resource): void => {
    setSelectedResource(resource)
    setDialogOpen(true)
  }

  const openDelete = (resource: Resource): void => {
    setSelectedResource(resource)
    setDeleteOpen(true)
  }

  const openDetails = (resource: Resource): void => {
    setSelectedResource(resource)
    setDetailsOpen(true)
  }

  const onSubmitResource = (data: Partial<Resource>): void => {
    if (selectedResource) {
      // EDIT
      setResources((prev) =>
        prev.map((r) =>
          r.id === selectedResource.id ? { ...r, ...data } as Resource : r
        )
      )
    } else {
      // CREATE
      const newResource: Resource = {
        id: uuid(),
        name: data.name!,
        type: data.type!,
        desc: data.desc!,
        host: data.host,
        port: data.port,
        team_id: data.team_id,
        owner_id: data.owner_id,
        credentials: data.credentials,
        logo: data.logo,
        created_at: new Date().toISOString(),
      }
      setResources((prev) => [...prev, newResource])
    }
  }

  const onDelete = (): void => {
    if (!selectedResource) return
    setResources((prev) => prev.filter((r) => r.id !== selectedResource.id))
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Resource
            </h1>
            <p className='text-muted-foreground'>
              Manage your organization's resource connections
            </p>
          </div>

          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>

        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter resources...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={handleSearch}
            />
            <Select value={resourceType} onValueChange={handleTypeChange}>
              <SelectTrigger className='w-36'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                <SelectItem value='database'>Database</SelectItem>
                <SelectItem value='api'>API</SelectItem>
                <SelectItem value='storage'>Storage</SelectItem>
                <SelectItem value='messaging'>Messaging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <SlidersHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='asc'>
                <div className='flex items-center gap-4'>
                  <ArrowUpAZ size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='desc'>
                <div className='flex items-center gap-4'>
                  <ArrowDownAZ size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </div>

        <Separator className='shadow-sm' />

        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {filteredResources.map((resource) => (
            <li
              key={resource.id}
              className='rounded-lg border p-4 hover:shadow-md transition-shadow'
            >
              <div className='mb-6 flex items-center justify-between'>
                <div
                  className={`bg-muted flex size-10 items-center justify-center rounded-lg p-2`}
                >
                  {resource.logo}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(resource)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => openDelete(resource)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
              <div className="mb-4">
                <h2 className='mb-1 font-semibold'>{resource.name}</h2>
                <p className='line-clamp-2 text-sm text-muted-foreground'>{resource.desc}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-muted capitalize">
                  {resource.type}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => openDetails(resource)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </li>
          ))}
        </ul>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No resources found matching your filters.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm('')
                setResourceType('all')
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <ResourceActionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          currentResource={selectedResource}
          teams={dummyTeams}
          onSubmitResource={onSubmitResource}
        />

        {/* Delete Dialog */}
        <ResourceDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDelete={onDelete}
          resourceName={selectedResource?.name || ""}
        />

        {/* Details Dialog */}
        <ResourceDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          resource={selectedResource}
          teams={dummyTeams}
        />
      </Main>
    </>
  )
}
