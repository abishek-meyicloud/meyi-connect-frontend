import { type ChangeEvent, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { SlidersHorizontal, ArrowUpAZ, ArrowDownAZ } from 'lucide-react'
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
import { resources } from './data/resources'

const route = getRouteApi('/_authenticated/resources/')

type ResourceType = 'all' | 'connected' | 'notConnected'

const resourceText = new Map<ResourceType, string>([
  ['all', 'All Resources'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export function Resources() {
  const {
    filter = '',
    type = 'all',
    sort: initSort = 'asc',
  } = route.useSearch()
  const navigate = route.useNavigate()

  const [sort, setSort] = useState(initSort)
  const [resourceType, setResourceType] = useState(type)
  const [searchTerm, setSearchTerm] = useState(filter)

  const filteredResources = resources
    .sort((a, b) =>
      sort === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((resource) =>
      resourceType === 'connected'
        ? resource.connected
        : resourceType === 'notConnected'
          ? !resource.connected
          : true
    )
    .filter((resource) => resource.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    navigate({
      search: (prev) => ({
        ...prev,
        filter: e.target.value || undefined,
      }),
    })
  }

  const handleTypeChange = (value: ResourceType) => {
    setResourceType(value)
    navigate({
      search: (prev) => ({
        ...prev,
        type: value === 'all' ? undefined : value,
      }),
    })
  }

  const handleSortChange = (sort: 'asc' | 'desc') => {
    setSort(sort)
    navigate({ search: (prev) => ({ ...prev, sort }) })
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Resource Integrations
          </h1>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your resources for the integration!
          </p>
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
                <SelectValue>{resourceText.get(resourceType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Resources</SelectItem>
                <SelectItem value='connected'>Connected</SelectItem>
                <SelectItem value='notConnected'>Not Connected</SelectItem>
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
        <Separator className='shadow-sm' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {filteredResources.map((resource) => (
            <li
              key={resource.name}
              className='rounded-lg border p-4 hover:shadow-md'
            >
              <div className='mb-8 flex items-center justify-between'>
                <div
                  className={`bg-muted flex size-10 items-center justify-center rounded-lg p-2`}
                >
                  {resource.logo}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className={`${resource.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                >
                  {resource.connected ? 'Connected' : 'Connect'}
                </Button>
              </div>
              <div>
                <h2 className='mb-1 font-semibold'>{resource.name}</h2>
                <p className='line-clamp-2 text-gray-500'>{resource.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Main>
    </>
  )
}
