'use client'

import { FilterDrawer } from '@/components/filter-drawer'
import { SearchFilterHeader } from '@/components/search-filter-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Download, Eye, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ProcessedResume } from '../page'
import ResumeDetailModal from './components/resume-detail-modal'

// Mock data - en una app real esto vendría de una base de datos
const mockResumes: ProcessedResume[] = [
  {
    id: '1',
    fileName: 'john_smith_resume.pdf',
    uploadDate: '2024-01-15',
    personalInfo: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
    },
    experience: [
      {
        company: 'TechCorp',
        position: 'Senior Software Engineer',
        duration: '2020 - Present',
        description:
          'Led development of scalable web applications using React and Node.js.',
      },
      {
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        duration: '2018 - 2020',
        description: 'Developed and maintained enterprise software solutions.',
      },
    ],
    education: [
      {
        institution: 'MIT',
        degree: 'Bachelor of Computer Science',
        year: '2018',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    summary:
      'Experienced software engineer with 6 years of expertise in full-stack development.',
    experienceYears: 6,
    industryCategory: 'Technology',
  },
  {
    id: '2',
    fileName: 'sarah_johnson_cv.pdf',
    uploadDate: '2024-01-14',
    personalInfo: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
    },
    experience: [
      {
        company: 'FinanceHub',
        position: 'Data Analyst',
        duration: '2021 - Present',
        description:
          'Analyzed financial data and created reports for executive decision making.',
      },
    ],
    education: [
      {
        institution: 'Stanford University',
        degree: 'Master of Business Administration',
        year: '2021',
      },
    ],
    skills: ['SQL', 'Python', 'Tableau', 'Excel', 'R', 'Power BI'],
    summary:
      'Data analyst with strong background in financial modeling and business intelligence.',
    experienceYears: 3,
    industryCategory: 'Finance',
  },
  {
    id: '3',
    fileName: 'michael_brown_resume.docx',
    uploadDate: '2024-01-13',
    personalInfo: {
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
    },
    experience: [
      {
        company: 'HealthTech Solutions',
        position: 'Product Manager',
        duration: '2019 - Present',
        description:
          'Managed product development lifecycle for healthcare applications.',
      },
    ],
    education: [
      {
        institution: 'University of Chicago',
        degree: 'Bachelor of Engineering',
        year: '2019',
      },
    ],
    skills: [
      'Product Management',
      'Agile',
      'Scrum',
      'Jira',
      'Figma',
      'Analytics',
    ],
    summary:
      'Product manager with 5 years of experience in healthcare technology solutions.',
    experienceYears: 5,
    industryCategory: 'Healthcare',
  },
  {
    id: '4',
    fileName: 'emily_davis_cv.pdf',
    uploadDate: '2024-01-12',
    personalInfo: {
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 321-0987',
      location: 'Austin, TX',
    },
    experience: [
      {
        company: 'EduTech Inc',
        position: 'UX Designer',
        duration: '2020 - Present',
        description:
          'Designed user interfaces for educational technology platforms.',
      },
    ],
    education: [
      {
        institution: 'University of Texas',
        degree: 'Bachelor of Design',
        year: '2020',
      },
    ],
    skills: [
      'UI/UX Design',
      'Figma',
      'Adobe Creative Suite',
      'Prototyping',
      'User Research',
    ],
    summary:
      'Creative UX designer specializing in educational technology and user experience.',
    experienceYears: 4,
    industryCategory: 'Education',
  },
  {
    id: '5',
    fileName: 'david_wilson_resume.pdf',
    uploadDate: '2024-01-11',
    personalInfo: {
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 654-3210',
      location: 'Seattle, WA',
    },
    experience: [
      {
        company: 'RetailMax',
        position: 'Marketing Manager',
        duration: '2018 - Present',
        description:
          'Developed and executed marketing campaigns for retail products.',
      },
    ],
    education: [
      {
        institution: 'University of Washington',
        degree: 'Bachelor of Marketing',
        year: '2018',
      },
    ],
    skills: [
      'Digital Marketing',
      'SEO',
      'Google Analytics',
      'Social Media',
      'Content Strategy',
    ],
    summary:
      'Marketing professional with 6 years of experience in retail and e-commerce.',
    experienceYears: 6,
    industryCategory: 'Retail',
  },
]

interface FilterState {
  searchTerm: string
  selectedIndustries: string[]
  selectedSkills: string[]
  experienceRange: [number, number]
  location: string
  sortBy: 'name' | 'date' | 'experience'
  sortOrder: 'asc' | 'desc'
}

interface ViewConfig {
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  showSummary: boolean
  showSkillsCount: number
  compactView: boolean
}

export default function ResumesListPage() {
  const [resumes] = useState<ProcessedResume[]>(mockResumes)
  const [selectedResume, setSelectedResume] = useState<ProcessedResume | null>(
    null
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedIndustries: [],
    selectedSkills: [],
    experienceRange: [0, 20],
    location: '',
    sortBy: 'date',
    sortOrder: 'desc',
  })

  const [viewConfig, setViewConfig] = useState<ViewConfig>({
    showEmail: true,
    showPhone: true,
    showLocation: true,
    showSummary: true,
    showSkillsCount: 5,
    compactView: false,
  })

  // Get unique values for filter options
  const uniqueIndustries = useMemo(
    () => [...new Set(resumes.map((r) => r.industryCategory))],
    [resumes]
  )
  const uniqueSkills = useMemo(
    () => [...new Set(resumes.flatMap((r) => r.skills))].slice(0, 20),
    [resumes]
  )
  const uniqueLocations = useMemo(
    () => [...new Set(resumes.map((r) => r.personalInfo.location))],
    [resumes]
  )

  // Filter and sort resumes
  const filteredAndSortedResumes = useMemo(() => {
    const filtered = resumes.filter((resume) => {
      const matchesSearch =
        filters.searchTerm === '' ||
        resume.personalInfo.name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        resume.summary
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        resume.skills.some((skill) =>
          skill.toLowerCase().includes(filters.searchTerm.toLowerCase())
        )

      const matchesIndustry =
        filters.selectedIndustries.length === 0 ||
        filters.selectedIndustries.includes(resume.industryCategory)

      const matchesSkills =
        filters.selectedSkills.length === 0 ||
        filters.selectedSkills.some((skill) => resume.skills.includes(skill))

      const matchesExperience =
        resume.experienceYears >= filters.experienceRange[0] &&
        resume.experienceYears <= filters.experienceRange[1]

      const matchesLocation =
        filters.location === '' ||
        filters.location === 'all' ||
        resume.personalInfo.location === filters.location

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesSkills &&
        matchesExperience &&
        matchesLocation
      )
    })

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case 'name':
          comparison = a.personalInfo.name.localeCompare(b.personalInfo.name)
          break
        case 'date':
          comparison =
            new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
          break
        case 'experience':
          comparison = a.experienceYears - b.experienceYears
          break
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [resumes, filters])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedResumes.length / itemsPerPage)
  const paginatedResumes = filteredAndSortedResumes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const updateViewConfig = (key: keyof ViewConfig, value: any) => {
    setViewConfig((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedIndustries: [],
      selectedSkills: [],
      experienceRange: [0, 20],
      location: '',
      sortBy: 'date',
      sortOrder: 'desc',
    })
    setCurrentPage(1)
  }

  const exportResults = () => {
    const csvContent = [
      [
        'Nombre',
        'Email',
        'Teléfono',
        'Ubicación',
        'Industria',
        'Años de Experiencia',
        'Habilidades',
      ],
      ...filteredAndSortedResumes.map((resume) => [
        resume.personalInfo.name,
        resume.personalInfo.email,
        resume.personalInfo.phone,
        resume.personalInfo.location,
        resume.industryCategory,
        resume.experienceYears.toString(),
        resume.skills.join('; '),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resumes_filtrados.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const activeFiltersCount =
    filters.selectedIndustries.length +
    filters.selectedSkills.length +
    (filters.location && filters.location !== 'all' ? 1 : 0) +
    (filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20 ? 1 : 0)

  const sortOptions = [
    { value: 'name', label: 'Ordenar por Nombre' },
    { value: 'date', label: 'Ordenar por Fecha' },
    { value: 'experience', label: 'Ordenar por Experiencia' },
  ]

  const getActiveFilters = () => {
    const activeFilters = []

    filters.selectedIndustries.forEach((industry) => {
      activeFilters.push({
        id: `industry-${industry}`,
        label: industry,
        value: industry,
      })
    })

    filters.selectedSkills.forEach((skill) => {
      activeFilters.push({
        id: `skill-${skill}`,
        label: skill,
        value: skill,
      })
    })

    if (filters.location && filters.location !== 'all') {
      activeFilters.push({
        id: 'location',
        label: `📍 ${filters.location}`,
        value: filters.location,
      })
    }

    if (filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20) {
      activeFilters.push({
        id: 'experience',
        label: `💼 ${filters.experienceRange[0]}-${filters.experienceRange[1]} años`,
        value: `${filters.experienceRange[0]}-${filters.experienceRange[1]}`,
      })
    }

    return activeFilters
  }

  const handleRemoveFilter = (filterId: string) => {
    if (filterId.startsWith('industry-')) {
      const industry = filterId.replace('industry-', '')
      updateFilter(
        'selectedIndustries',
        filters.selectedIndustries.filter((i) => i !== industry)
      )
    } else if (filterId.startsWith('skill-')) {
      const skill = filterId.replace('skill-', '')
      updateFilter(
        'selectedSkills',
        filters.selectedSkills.filter((s) => s !== skill)
      )
    } else if (filterId === 'location') {
      updateFilter('location', '')
    } else if (filterId === 'experience') {
      updateFilter('experienceRange', [0, 20])
    }
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lista de Resumes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredAndSortedResumes.length} de {resumes.length} resumes
              encontrados
            </p>
          </div>
        </div>

        {/* Search and Filter Header */}
        <SearchFilterHeader
          searchPlaceholder="Buscar por nombre, habilidades o resumen..."
          searchTerm={filters.searchTerm}
          onSearchChange={(value) => updateFilter('searchTerm', value)}
          sortOptions={sortOptions}
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
          title="Configuración de Filtros y Vista"
          description="Personaliza cómo quieres ver y filtrar los resumes"
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        >
          {/* Quick Actions */}
          <div className="flex justify-between">
            <Button onClick={clearFilters} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
            <Button
              onClick={exportResults}
              size="sm"
              disabled={filteredAndSortedResumes.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          <Separator />

          {/* Experience Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              💼 Experiencia: {filters.experienceRange[0]} -{' '}
              {filters.experienceRange[1]} años
            </Label>
            <Slider
              value={filters.experienceRange}
              onValueChange={(value) => updateFilter('experienceRange', value)}
              max={20}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Industries */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">🏢 Industrias</Label>
            <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto">
              {uniqueIndustries.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={filters.selectedIndustries.includes(industry)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('selectedIndustries', [
                          ...filters.selectedIndustries,
                          industry,
                        ])
                      } else {
                        updateFilter(
                          'selectedIndustries',
                          filters.selectedIndustries.filter(
                            (i) => i !== industry
                          )
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={`industry-${industry}`}
                    className="text-sm font-normal"
                  >
                    {industry}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">📍 Ubicación</Label>
            <Select
              value={filters.location}
              onValueChange={(value) => updateFilter('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las ubicaciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ubicaciones</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Skills */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">🛠️ Habilidades</Label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {uniqueSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={filters.selectedSkills.includes(skill)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('selectedSkills', [
                          ...filters.selectedSkills,
                          skill,
                        ])
                      } else {
                        updateFilter(
                          'selectedSkills',
                          filters.selectedSkills.filter((s) => s !== skill)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={`skill-${skill}`}
                    className="text-sm font-normal"
                  >
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* View Configuration */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              👁️ Configuración de Vista
            </Label>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-view" className="text-sm">
                  Vista Compacta
                </Label>
                <Switch
                  id="compact-view"
                  checked={viewConfig.compactView}
                  onCheckedChange={(checked) =>
                    updateViewConfig('compactView', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-email" className="text-sm">
                  Mostrar Email
                </Label>
                <Switch
                  id="show-email"
                  checked={viewConfig.showEmail}
                  onCheckedChange={(checked) =>
                    updateViewConfig('showEmail', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-phone" className="text-sm">
                  Mostrar Teléfono
                </Label>
                <Switch
                  id="show-phone"
                  checked={viewConfig.showPhone}
                  onCheckedChange={(checked) =>
                    updateViewConfig('showPhone', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-location" className="text-sm">
                  Mostrar Ubicación
                </Label>
                <Switch
                  id="show-location"
                  checked={viewConfig.showLocation}
                  onCheckedChange={(checked) =>
                    updateViewConfig('showLocation', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-summary" className="text-sm">
                  Mostrar Resumen
                </Label>
                <Switch
                  id="show-summary"
                  checked={viewConfig.showSummary}
                  onCheckedChange={(checked) =>
                    updateViewConfig('showSummary', checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">
                  Habilidades a mostrar: {viewConfig.showSkillsCount}
                </Label>
                <Slider
                  value={[viewConfig.showSkillsCount]}
                  onValueChange={(value) =>
                    updateViewConfig('showSkillsCount', value[0])
                  }
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </FilterDrawer>

        {/* Results List */}
        <div className="space-y-4">
          {paginatedResumes.map((resume) => (
            <Card
              key={resume.id}
              className={`hover:shadow-md transition-shadow ${
                viewConfig.compactView ? 'py-2' : ''
              }`}
            >
              <CardContent className={viewConfig.compactView ? 'p-4' : 'p-6'}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3
                        className={`font-semibold text-gray-900 dark:text-white ${
                          viewConfig.compactView ? 'text-base' : 'text-lg'
                        }`}
                      >
                        {resume.personalInfo.name}
                      </h3>
                      <Badge variant="secondary">
                        {resume.industryCategory}
                      </Badge>
                      <Badge variant="outline">
                        {resume.experienceYears} años exp.
                      </Badge>
                    </div>

                    {!viewConfig.compactView && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {viewConfig.showEmail && (
                          <div>
                            <strong>Email:</strong> {resume.personalInfo.email}
                          </div>
                        )}
                        {viewConfig.showPhone && (
                          <div>
                            <strong>Teléfono:</strong>{' '}
                            {resume.personalInfo.phone}
                          </div>
                        )}
                        {viewConfig.showLocation && (
                          <div>
                            <strong>Ubicación:</strong>{' '}
                            {resume.personalInfo.location}
                          </div>
                        )}
                      </div>
                    )}

                    {viewConfig.showSummary && !viewConfig.compactView && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {resume.summary}
                        </p>
                      </div>
                    )}

                    {viewConfig.showSkillsCount > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {resume.skills
                          .slice(0, viewConfig.showSkillsCount)
                          .map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {resume.skills.length > viewConfig.showSkillsCount && (
                          <Badge variant="outline" className="text-xs">
                            +{resume.skills.length - viewConfig.showSkillsCount}{' '}
                            más
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Subido: {resume.uploadDate}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedResume(resume)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
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
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedResumes.length
                  )}{' '}
                  de {filteredAndSortedResumes.length} resultados
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
                    Anterior
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
                    Siguiente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {filteredAndSortedResumes.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron resumes que coincidan con los filtros
                aplicados.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4 bg-transparent"
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resume Detail Modal */}
      {selectedResume && (
        <ResumeDetailModal
          resume={selectedResume}
          isOpen={!!selectedResume}
          onClose={() => setSelectedResume(null)}
        />
      )}
    </div>
  )
}
