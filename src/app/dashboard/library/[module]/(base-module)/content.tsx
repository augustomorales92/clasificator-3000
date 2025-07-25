'use client'

import { FilterDrawer } from '@/components/filter-drawer'
import { SearchFilterHeader } from '@/components/search-filter-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Routes } from '@/constants/routes'
import { useI18n } from '@/lib/i18n/i18n-context'
import { format } from 'date-fns'
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Loader2,
  X,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'

interface ProcessedFile {
  id: string
  filename: string
  originalSize: number
  uploadDate: string
  uploadTime: string
  status: 'processing' | 'completed' | 'failed'
  processingTime?: number
  fileType: string
  dimensions?: {
    width: number
    height: number
  }
  enhancementTypes: string[]
  thumbnailUrl: string
  originalUrl: string
  processedUrls: {
    enhanced: string
    upscaled: string
    denoised: string
    colorCorrected: string
  }
}

// Mock data for demonstration
const mockFiles: ProcessedFile[] = [
  {
    id: '1',
    filename: 'landscape_photo.jpg',
    originalSize: 2048000,
    uploadDate: '2024-01-20',
    uploadTime: '14:30:25',
    status: 'completed',
    processingTime: 45,
    fileType: 'JPEG',
    dimensions: { width: 1920, height: 1080 },
    enhancementTypes: [
      'AI Enhancement',
      'Upscaling',
      'Noise Reduction',
      'Color Correction',
    ],
    thumbnailUrl: '/placeholder.svg?height=120&width=160&text=Landscape',
    originalUrl:
      '/placeholder.svg?height=400&width=600&text=Original+Landscape',
    processedUrls: {
      enhanced:
        '/placeholder.svg?height=400&width=600&text=AI+Enhanced+Landscape',
      upscaled: '/placeholder.svg?height=400&width=600&text=Upscaled+Landscape',
      denoised: '/placeholder.svg?height=400&width=600&text=Denoised+Landscape',
      colorCorrected:
        '/placeholder.svg?height=400&width=600&text=Color+Corrected+Landscape',
    },
  },
  {
    id: '2',
    filename: 'portrait_session.png',
    originalSize: 3072000,
    uploadDate: '2024-01-20',
    uploadTime: '12:15:10',
    status: 'processing',
    fileType: 'PNG',
    dimensions: { width: 1080, height: 1350 },
    enhancementTypes: ['AI Enhancement', 'Upscaling', 'Noise Reduction'],
    thumbnailUrl: '/placeholder.svg?height=120&width=160&text=Portrait',
    originalUrl: '/placeholder.svg?height=400&width=600&text=Original+Portrait',
    processedUrls: {
      enhanced:
        '/placeholder.svg?height=400&width=600&text=AI+Enhanced+Portrait',
      upscaled: '/placeholder.svg?height=400&width=600&text=Upscaled+Portrait',
      denoised: '/placeholder.svg?height=400&width=600&text=Denoised+Portrait',
      colorCorrected:
        '/placeholder.svg?height=400&width=600&text=Color+Corrected+Portrait',
    },
  },
  {
    id: '3',
    filename: 'old_family_photo.jpg',
    originalSize: 1536000,
    uploadDate: '2024-01-19',
    uploadTime: '16:45:33',
    status: 'completed',
    processingTime: 67,
    fileType: 'JPEG',
    dimensions: { width: 800, height: 600 },
    enhancementTypes: [
      'AI Enhancement',
      'Upscaling',
      'Noise Reduction',
      'Color Correction',
    ],
    thumbnailUrl: '/placeholder.svg?height=120&width=160&text=Family+Photo',
    originalUrl: '/placeholder.svg?height=400&width=600&text=Original+Family',
    processedUrls: {
      enhanced: '/placeholder.svg?height=400&width=600&text=AI+Enhanced+Family',
      upscaled: '/placeholder.svg?height=400&width=600&text=Upscaled+Family',
      denoised: '/placeholder.svg?height=400&width=600&text=Denoised+Family',
      colorCorrected:
        '/placeholder.svg?height=400&width=600&text=Color+Corrected+Family',
    },
  },
  {
    id: '4',
    filename: 'architecture_shot.jpg',
    originalSize: 4096000,
    uploadDate: '2024-01-19',
    uploadTime: '09:20:15',
    status: 'failed',
    fileType: 'JPEG',
    dimensions: { width: 2048, height: 1536 },
    enhancementTypes: ['AI Enhancement', 'Upscaling'],
    thumbnailUrl: '/placeholder.svg?height=120&width=160&text=Architecture',
    originalUrl:
      '/placeholder.svg?height=400&width=600&text=Original+Architecture',
    processedUrls: {
      enhanced:
        '/placeholder.svg?height=400&width=600&text=AI+Enhanced+Architecture',
      upscaled:
        '/placeholder.svg?height=400&width=600&text=Upscaled+Architecture',
      denoised:
        '/placeholder.svg?height=400&width=600&text=Denoised+Architecture',
      colorCorrected:
        '/placeholder.svg?height=400&width=600&text=Color+Corrected+Architecture',
    },
  },
  {
    id: '5',
    filename: 'nature_macro.png',
    originalSize: 2560000,
    uploadDate: '2024-01-18',
    uploadTime: '11:30:45',
    status: 'completed',
    processingTime: 52,
    fileType: 'PNG',
    dimensions: { width: 1600, height: 1200 },
    enhancementTypes: ['AI Enhancement', 'Noise Reduction', 'Color Correction'],
    thumbnailUrl: '/placeholder.svg?height=120&width=160&text=Nature+Macro',
    originalUrl: '/placeholder.svg?height=400&width=600&text=Original+Nature',
    processedUrls: {
      enhanced: '/placeholder.svg?height=400&width=600&text=AI+Enhanced+Nature',
      upscaled: '/placeholder.svg?height=400&width=600&text=Upscaled+Nature',
      denoised: '/placeholder.svg?height=400&width=600&text=Denoised+Nature',
      colorCorrected:
        '/placeholder.svg?height=400&width=600&text=Color+Corrected+Nature',
    },
  },
]

interface FilterState {
  searchTerm: string
  status: string[]
  fileType: string[]
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  sortBy: 'date' | 'filename' | 'size' | 'processingTime'
  sortOrder: 'asc' | 'desc'
}

export default function LibraryContent({ module }: { module: string }) {
  const [files] = useState<ProcessedFile[]>(mockFiles)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { t } = useI18n()

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: [],
    fileType: [],
    dateRange: { from: undefined, to: undefined },
    sortBy: 'date',
    sortOrder: 'desc',
  })

  // Get unique values for filter options
  const uniqueStatuses = ['processing', 'completed', 'failed']
  const uniqueFileTypes = [...new Set(files.map((f) => f.fileType))]

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    const filtered = files.filter((file) => {
      const matchesSearch =
        filters.searchTerm === '' ||
        file.filename.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(file.status)

      const matchesFileType =
        filters.fileType.length === 0 ||
        filters.fileType.includes(file.fileType)

      const matchesDateRange =
        (!filters.dateRange.from ||
          new Date(file.uploadDate) >= filters.dateRange.from) &&
        (!filters.dateRange.to ||
          new Date(file.uploadDate) <= filters.dateRange.to)

      return (
        matchesSearch && matchesStatus && matchesFileType && matchesDateRange
      )
    })

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case 'filename':
          comparison = a.filename.localeCompare(b.filename)
          break
        case 'date':
          comparison =
            new Date(`${a.uploadDate} ${a.uploadTime}`).getTime() -
            new Date(`${b.uploadDate} ${b.uploadTime}`).getTime()
          break
        case 'size':
          comparison = a.originalSize - b.originalSize
          break
        case 'processingTime':
          comparison = (a.processingTime || 0) - (b.processingTime || 0)
          break
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [files, filters])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedFiles.length / itemsPerPage)
  const paginatedFiles = filteredAndSortedFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: [],
      fileType: [],
      dateRange: { from: undefined, to: undefined },
      sortBy: 'date',
      sortOrder: 'desc',
    })
    setCurrentPage(1)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      processing: 'secondary',
      failed: 'destructive',
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const activeFiltersCount =
    filters.status.length +
    filters.fileType.length +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0)

  const sortOptions = [
    { value: 'date', label: 'Upload Date' },
    { value: 'filename', label: 'Filename' },
    { value: 'size', label: 'File Size' },
    { value: 'processingTime', label: 'Processing Time' },
  ]

  const getActiveFilters = () => {
    const activeFilters = []

    filters.status.forEach((status) => {
      activeFilters.push({
        id: `status-${status}`,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
      })
    })

    filters.fileType.forEach((type) => {
      activeFilters.push({
        id: `filetype-${type}`,
        label: type,
        value: type,
      })
    })

    if (filters.dateRange.from || filters.dateRange.to) {
      activeFilters.push({
        id: 'daterange',
        label: `📅 ${
          filters.dateRange.from
            ? format(filters.dateRange.from, 'MMM dd')
            : 'Start'
        } - ${
          filters.dateRange.to ? format(filters.dateRange.to, 'MMM dd') : 'End'
        }`,
        value: 'daterange',
      })
    }

    return activeFilters
  }

  const handleRemoveFilter = (filterId: string) => {
    if (filterId.startsWith('status-')) {
      const status = filterId.replace('status-', '')
      updateFilter(
        'status',
        filters.status.filter((s) => s !== status)
      )
    } else if (filterId.startsWith('filetype-')) {
      const type = filterId.replace('filetype-', '')
      updateFilter(
        'fileType',
        filters.fileType.filter((t) => t !== type)
      )
    } else if (filterId === 'daterange') {
      updateFilter('dateRange', { from: undefined, to: undefined })
    }
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold ">{t('library.title')}</h1>
            <p className="text-gray-600 mt-1">
              {t('library.filesFound', {
                count: filteredAndSortedFiles.length,
                total: files.length,
              })}
            </p>
          </div>
        </div>

        {/* Search and Filter Header */}
        <SearchFilterHeader
          searchPlaceholder={t('library.search.placeholder')}
          searchTerm={filters.searchTerm}
          onSearchChange={(value) => updateFilter('searchTerm', value)}
          sortOptions={[
            { value: 'date', label: t('library.filters.sort.options.date') },
            {
              value: 'filename',
              label: t('library.filters.sort.options.filename'),
            },
            { value: 'size', label: t('library.filters.sort.options.size') },
            {
              value: 'processingTime',
              label: t('library.filters.sort.options.processingTime'),
            },
          ]}
          selectedSort={filters.sortBy}
          onSortChange={(value) => updateFilter('sortBy', value)}
          sortOrder={filters.sortOrder}
          onSortOrderChange={() =>
            updateFilter(
              'sortOrder',
              filters.sortOrder === 'asc' ? 'desc' : 'asc'
            )
          }
          activeFilters={getActiveFilters()}
          onRemoveFilter={handleRemoveFilter}
          onClearFilters={clearFilters}
          onOpenAdvancedFilters={() => setIsDrawerOpen(true)}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Filter Drawer */}
        <FilterDrawer
          title={t('library.filters.title')}
          description={t('library.filters.description')}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        >
          {/* Quick Actions */}
          <div className="flex justify-end">
            <Button onClick={clearFilters} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              {t('common.actions.clear_filters')}
            </Button>
          </div>

          <Separator />

          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              📊 {t('library.filters.status')}
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {uniqueStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('status', [...filters.status, status])
                      } else {
                        updateFilter(
                          'status',
                          filters.status.filter((s) => s !== status)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-sm font-normal flex items-center space-x-2"
                  >
                    {getStatusIcon(status)}
                    <span>{t(`common.status.${status}`)}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* File Type Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              📁 {t('library.filters.fileType')}
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {uniqueFileTypes.map((fileType) => (
                <div key={fileType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filetype-${fileType}`}
                    checked={filters.fileType.includes(fileType)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('fileType', [
                          ...filters.fileType,
                          fileType,
                        ])
                      } else {
                        updateFilter(
                          'fileType',
                          filters.fileType.filter((t) => t !== fileType)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={`filetype-${fileType}`}
                    className="text-sm font-normal"
                  >
                    {fileType}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Range Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              📅 {t('library.filters.dateRange.title')}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from
                      ? format(filters.dateRange.from, 'PPP')
                      : t('library.filters.dateRange.from')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    onSelect={(date) =>
                      updateFilter('dateRange', {
                        ...filters.dateRange,
                        from: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to
                      ? format(filters.dateRange.to, 'PPP')
                      : t('library.filters.dateRange.to')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    onSelect={(date) =>
                      updateFilter('dateRange', {
                        ...filters.dateRange,
                        to: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Sorting */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              🔄 {t('library.filters.sort.title')}
            </Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">
                  {t('library.filters.sort.options.date')}
                </SelectItem>
                <SelectItem value="filename">
                  {t('library.filters.sort.options.filename')}
                </SelectItem>
                <SelectItem value="size">
                  {t('library.filters.sort.options.size')}
                </SelectItem>
                <SelectItem value="processingTime">
                  {t('library.filters.sort.options.processingTime')}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => updateFilter('sortOrder', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  {t('library.filters.sort.order.desc')}
                </SelectItem>
                <SelectItem value="asc">
                  {t('library.filters.sort.order.asc')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterDrawer>

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {paginatedFiles.map((file) => (
            <Card
              key={file.id}
              className="hover:shadow-lg transition-all duration-200 group"
            >
              <CardContent className="p-0 flex flex-col h-full">
                {/* Large Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
                  <Image
                    src={file.thumbnailUrl || '/placeholder.svg'}
                    alt={file.filename}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    width={100}
                    height={100}
                    />
                  {/* Status Overlay */}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(file.status)}
                  </div>
                  {/* Processing Overlay */}
                  {file.status === 'processing' && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3">
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* File Information */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="space-y-3 flex-grow">
                    {/* Filename and Type */}
                    <div className="space-y-1">
                      <h3
                        className="font-semibold truncate text-lg"
                        title={file.filename}
                      >
                        {file.filename}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {file.fileType}
                        </Badge>
                        {file.dimensions && (
                          <span className="text-xs text-gray-500">
                            {t('library.fileInfo.dimensions', {
                              width: file.dimensions.width,
                              height: file.dimensions.height,
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Upload Info */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>{t('library.fileInfo.uploaded')}:</span>
                        <span>
                          {format(new Date(file.uploadDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t('library.fileInfo.size')}:</span>
                        <span>{formatFileSize(file.originalSize)}</span>
                      </div>
                      {file.processingTime && (
                        <div className="flex items-center justify-between">
                          <span>{t('library.fileInfo.processing')}:</span>
                          <span>{file.processingTime}s</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Section with Enhancement Types and Actions */}
                  <div className="space-y-4 mt-auto pt-4">
                    {/* Enhancement Types */}
                    <div className="flex flex-wrap gap-1">
                      {file.enhancementTypes.slice(0, 3).map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                      {file.enhancementTypes.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{file.enhancementTypes.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`${Routes[
                          `${module.toUpperCase()}_LIBRARY_DETAILS` as keyof typeof Routes
                        ].replace(':id', file.id)}`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t('common.actions.view_details')}
                        </Button>
                      </Link>
                      {file.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {t('library.pagination.showing', {
                    from: (currentPage - 1) * itemsPerPage + 1,
                    to: Math.min(
                      currentPage * itemsPerPage,
                      filteredAndSortedFiles.length
                    ),
                    total: filteredAndSortedFiles.length,
                  })}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    {t('common.actions.previous')}
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    {t('common.actions.next')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {filteredAndSortedFiles.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">{t('library.search.noResults')}</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4 bg-transparent"
              >
                {t('common.actions.clear_filters')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
