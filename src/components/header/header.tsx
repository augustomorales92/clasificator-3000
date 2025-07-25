'use client'

import { HeaderButtons } from '@/components/header/header-buttons'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean)
  const combinedPaths = []

  for (let i = 0; i < paths.length; i++) {
    if (paths[i] === 'library' && i + 1 < paths.length) {
      const nextPath =
        paths[i + 1].charAt(0).toUpperCase() + paths[i + 1].slice(1)
      combinedPaths.push({
        href: `/${paths.slice(0, i + 2).join('/')}`,
        label: `Library ${nextPath}`,
        isLast: i + 1 === paths.length - 1,
      })
      i++ // Skip next iteration since we combined it
    } else {
      const href = `/${paths.slice(0, i + 1).join('/')}`
      const label =
        paths[i].charAt(0).toUpperCase() + paths[i].slice(1).replace(/-/g, ' ')
      combinedPaths.push({ href, label, isLast: i === paths.length - 1 })
    }
  }

  return combinedPaths
}

export function Header() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  if (breadcrumbs.length === 0) {
    return (
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <HeaderButtons />
      </header>
    )
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => (
              <span
                key={`${breadcrumb.href}-${index}`}
                className="flex items-center gap-2"
              >
                <BreadcrumbSeparator />
                <BreadcrumbItem key={breadcrumb.href}>
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : breadcrumb.label === 'Library' ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <HeaderButtons />
    </header>
  )
}
