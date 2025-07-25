'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/header/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 h-full">
          <Header />
          <div className="flex flex-1 h-[calc(100%-4rem)]">
            <main className="flex-1 h-full overflow-auto">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  )
}
