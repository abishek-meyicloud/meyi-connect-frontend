import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { KeysDialogs } from './components/keys-dialogs' 
import { KeysPrimaryButtons } from './components/keys-primary-buttons'
import { KeysProvider } from './components/keys-provider'
import { KeysTable } from './components/keys-table'
import { keys }  from './data/keys'

export function Keys() {
  return (
    <KeysProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Keys</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your keys for this month!
            </p>
          </div>
          <KeysPrimaryButtons />
        </div>
        <KeysTable data={keys} />
      </Main>

      <KeysDialogs />
    </KeysProvider>
  )
}
