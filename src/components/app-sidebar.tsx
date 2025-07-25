import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { routes } from '@/constants/routes'
import { useSession } from '@/lib/auth-client'
import { UserWithPermissions } from '@/lib/types'
import { FileUser } from 'lucide-react'
import Link from 'next/link'
import { NavUser } from './nav-user'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const user = session?.user as UserWithPermissions
  const userRoles = user?.role ? [user.role] : ['user']
  const userPermissions = user?.permissions || {}

  const hasPermissions = (route: (typeof routes)[0]) => {
    if (!route.resource || !route.requiredPermissions) return true
    const resourcePermissions = userPermissions[route.resource] || []
    return route.requiredPermissions.every((perm) =>
      resourcePermissions.includes(perm)
    )
  }

  const hasRole = (route: (typeof routes)[0]) => {
    if (!route.roles) return true
    return route.roles.some((role) => userRoles.includes(role))
  }

  const hasResourceAccess = (route: (typeof routes)[0]) => {
    if (!route.resource) return true
    return userPermissions[route.resource]?.length > 0
  }

  const filteredRoutes = routes
    .filter(
      (route) =>
        hasRole(route) && hasPermissions(route) && hasResourceAccess(route)
    )
    .map((route) => ({
      ...route,
      items: route.items?.filter((item) => {
        const itemAsRoute = item as (typeof routes)[0]
        return hasRole(itemAsRoute) && hasPermissions(itemAsRoute)
      }),
    }))

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <FileUser className="!size-5" />
                <span className="text-base font-semibold">Calculator 3000</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {filteredRoutes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items?.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <Link href={item.url ?? ''}>
                          {Icon && <Icon className="size-5" />}
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || 'Loading...',
            email: user?.email || '',
            avatar: 'https://github.com/shadcn.png',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
