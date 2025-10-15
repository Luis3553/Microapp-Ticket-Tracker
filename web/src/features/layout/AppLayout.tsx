import * as React from 'react'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import {
  Bell,
  CircleHelp,
  FolderKanban,
  Home,
  LogOut,
  Menu,
  Search,
  Tag,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/features/shared/components/ui/sheet'
import { ScrollArea } from '@/features/shared/components/ui/scroll-area'
import { Button } from '@/features/shared/components/ui/button'
import { Input } from '@/features/shared/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/features/shared/components/ui/avatar'
import { Separator } from '@/features/shared/components/ui/separator'
import { useAuthSession } from '@/features/auth/hooks/useAuthSession'
import { useAuthMutations } from '@/features/auth/hooks/useAuthMutations'

type NavItem = { title: string; href: string; icon: React.ElementType }

const NAV_ITEMS: Array<NavItem> = [
  { title: 'Overview', href: '/app', icon: Home },
  { title: 'Projects', href: '/app/projects', icon: FolderKanban },
  { title: 'Issues', href: '/app/issues', icon: CircleHelp },
  { title: 'Labels', href: '/app/labels', icon: Tag },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouterState()
  const current = router.location.href

  return (
    <aside className="hidden md:flex w-40 shrink-0 border-r bg-background">
      <div className="flex h-full flex-col w-full">
        <div className="h-14 flex items-center px-4 text-xl font-semibold tracking-tight">
          Microapp
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <nav className="p-2 space-y-1">
            {NAV_ITEMS.map(({ title, href, icon: Icon }) => {
              const isActive = current.startsWith(href)
              return (
                <Link
                  key={href}
                  to={href}
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
                    ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{title}</span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  )
}

function MobileSidebar() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <div className="h-14 flex items-center px-4 text-xl font-semibold">
          Microapp
        </div>
        <Separator />
        <SidebarNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export default function AppLayout() {
  const { user } = useAuthSession()
  const { logout } = useAuthMutations({})

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar (desktop) */}
        <SidebarNav />

        {/* Main column */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 h-14 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-3 px-4">
              <MobileSidebar />
              {/* Search */}
              <div className="relative ml-1 flex-1 max-w-xl">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search…" />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
              >
                <Bell className="h-5 w-5" />
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {user?.name[0]?.toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm">
                      {user?.name ?? 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    {user?.email ?? '—'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/app">Overview</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/app/projects">Projects</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    {/* <Link to="/app/issues">Issues</Link> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    {/* <Link to="/app/labels">Labels</Link> */}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout.mutate()}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
