import { Permission } from '@/lib/types'
import { Briefcase, Clock, FileText, Home, Library } from 'lucide-react'

export type Resource =
  | 'resumes'
  | 'jobs'
  | 'prescriptions'
  | 'invoices'
  | 'library'

interface Route {
  title: string
  url?: string
  items?: Route[]
  isActive?: boolean
  icon?: React.ElementType
  roles?: Array<'user' | 'admin' | 'superadmin'>
  resource?: Resource
  requiredPermissions?: Permission[]
}

export enum Routes {
  DASHBOARD = '/dashboard',
  RESUMES = '/dashboard/resumes',
  JOBS = '/dashboard/jobs',
  RESUMES_LIBRARY = '/dashboard/library/resumes',
  RESUMES_LIBRARY_DETAILS = '/dashboard/library/resumes/:id',
  PRESCRIPTIONS_LIBRARY = '/dashboard/library/prescriptions',
  PRESCRIPTIONS_LIBRARY_DETAILS = '/dashboard/library/prescriptions/:id',
  INVOICES_LIBRARY = '/dashboard/library/invoices',
  INVOICES_LIBRARY_DETAILS = '/dashboard/library/invoices/:id',
  JOB_DETAILS = '/dashboard/jobs/:id',
  JOB_CANDIDATES = '/dashboard/jobs/:id/candidates',
  PRESCRIPTIONS = '/dashboard/prescriptions',
  PRESCRIPTION_DETAILS = '/dashboard/prescriptions/:id',
  INVOICES = '/dashboard/invoices',
  INVOICE_DETAILS = '/dashboard/invoices/:id',
  STATUS = '/dashboard/status',
}

export const routes: Route[] = [
  {
    title: 'Dashboard',
    url: Routes.DASHBOARD,
    items: [
      {
        title: 'Home',
        url: Routes.DASHBOARD,
        icon: Home,
      },
      {
        title: 'Status',
        url: Routes.STATUS,
        icon: Clock,
        roles: ['user', 'superadmin'],
      },
    ],
  },
  {
    title: 'HR',
    resource: 'resumes',
    items: [
      {
        title: 'Resumes',
        url: Routes.RESUMES,
        icon: FileText,
        resource: 'resumes',
        requiredPermissions: ['read', 'write'],
      },
      {
        title: 'Job Offers',
        url: Routes.JOBS,
        icon: Briefcase,
        resource: 'jobs',
        requiredPermissions: ['read', 'write'],
      },
      {
        title: 'Library',
        url: Routes.RESUMES_LIBRARY,
        icon: Library,
        resource: 'resumes',
        requiredPermissions: ['read'],
      },
    ],
  },
  {
    title: 'Medical',
    resource: 'prescriptions',
    items: [
      {
        title: 'Prescriptions',
        url: Routes.PRESCRIPTIONS,
        icon: FileText,
        resource: 'prescriptions',
        requiredPermissions: ['read', 'write'],
      },
      {
        title: 'Library',
        url: Routes.PRESCRIPTIONS_LIBRARY,
        icon: Library,
        resource: 'prescriptions',
        requiredPermissions: ['read'],
      },
    ],
  },
  {
    title: 'Administration',
    resource: 'invoices',
    items: [
      {
        title: 'Invoices',
        url: Routes.INVOICES,
        icon: FileText,
        resource: 'invoices',
        requiredPermissions: ['read', 'write'],
      },
      {
        title: 'Library',
        url: Routes.INVOICES_LIBRARY,
        icon: Library,
        resource: 'library',
        requiredPermissions: ['read'],
      },
    ],
  },
]
