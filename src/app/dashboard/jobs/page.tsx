  'use client'

import { Routes } from '@/constants/routes'
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
import {
  Building,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  Plus,
  Search,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  salary: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  skills: string[]
  experience: string
  postedDate: string
  applicationDeadline: string
  contactEmail: string
  isActive: boolean
}

// Mock job data
const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: { min: 120000, max: 180000, currency: 'USD' },
    description:
      'We are looking for a senior software engineer to join our growing team. You will be responsible for designing and implementing scalable web applications using modern technologies.',
    requirements: [
      "Bachelor's degree in Computer Science",
      '5+ years of experience',
      'Strong problem-solving skills',
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    experience: '5+ years',
    postedDate: '2024-01-20',
    applicationDeadline: '2024-02-20',
    contactEmail: 'hiring@techcorp.com',
    isActive: true,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateLab',
    location: 'New York, NY',
    type: 'full-time',
    salary: { min: 100000, max: 140000, currency: 'USD' },
    description:
      'Join our product team to drive the development of cutting-edge solutions. You will work closely with engineering and design teams to deliver exceptional user experiences.',
    requirements: [
      'MBA or equivalent experience',
      '3+ years in product management',
      'Strong analytical skills',
    ],
    skills: [
      'Product Strategy',
      'Agile',
      'Scrum',
      'Analytics',
      'User Research',
      'Roadmapping',
    ],
    experience: '3+ years',
    postedDate: '2024-01-19',
    applicationDeadline: '2024-02-15',
    contactEmail: 'careers@innovatelab.com',
    isActive: true,
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    type: 'remote',
    salary: { min: 80000, max: 120000, currency: 'USD' },
    description:
      "We're seeking a talented UX designer to create intuitive and engaging user experiences. You'll collaborate with cross-functional teams to design user-centered solutions.",
    requirements: [
      "Bachelor's in Design or related field",
      '3+ years of UX design experience',
      'Portfolio required',
    ],
    skills: [
      'Figma',
      'Sketch',
      'Prototyping',
      'User Research',
      'Wireframing',
      'Design Systems',
    ],
    experience: '3+ years',
    postedDate: '2024-01-18',
    applicationDeadline: '2024-02-10',
    contactEmail: 'design@designstudio.com',
    isActive: true,
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'DataTech Solutions',
    location: 'Austin, TX',
    type: 'full-time',
    salary: { min: 110000, max: 160000, currency: 'USD' },
    description:
      "Join our data science team to extract insights from complex datasets. You'll build machine learning models and work on predictive analytics projects.",
    requirements: [
      "Master's in Data Science or related field",
      '4+ years of experience',
      'Strong statistical background',
    ],
    skills: [
      'Python',
      'R',
      'SQL',
      'Machine Learning',
      'TensorFlow',
      'Pandas',
      'Tableau',
    ],
    experience: '4+ years',
    postedDate: '2024-01-17',
    applicationDeadline: '2024-02-05',
    contactEmail: 'data@datatech.com',
    isActive: true,
  },
  {
    id: '5',
    title: 'Marketing Specialist',
    company: 'GrowthCo',
    location: 'Chicago, IL',
    type: 'part-time',
    salary: { min: 50000, max: 70000, currency: 'USD' },
    description:
      "We're looking for a creative marketing specialist to develop and execute marketing campaigns. You'll work on digital marketing, content creation, and brand management.",
    requirements: [
      "Bachelor's in Marketing or related field",
      '2+ years of marketing experience',
      'Creative mindset',
    ],
    skills: [
      'Digital Marketing',
      'SEO',
      'Content Marketing',
      'Social Media',
      'Google Analytics',
      'Adobe Creative Suite',
    ],
    experience: '2+ years',
    postedDate: '2024-01-16',
    applicationDeadline: '2024-02-01',
    contactEmail: 'marketing@growthco.com',
    isActive: true,
  },
]

interface FilterState {
  searchTerm: string
  location: string
  jobType: string[]
  salaryRange: [number, number]
  experience: string[]
  skills: string[]
  sortBy: 'date' | 'title' | 'company' | 'salary'
  sortOrder: 'asc' | 'desc'
}

export default function JobBoardPage() {
  const [jobs] = useState<JobPosting[]>(mockJobs)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    location: '',
    jobType: [],
    salaryRange: [0, 200000],
    experience: [],
    skills: [],
    sortBy: 'date',
    sortOrder: 'desc',
  })

  // Get unique values for filter options
  const uniqueLocations = [...new Set(jobs.map((j) => j.location))]
  const uniqueJobTypes = ['full-time', 'part-time', 'contract', 'remote']
  const uniqueExperience = [...new Set(jobs.map((j) => j.experience))]
  const uniqueSkills = [...new Set(jobs.flatMap((j) => j.skills))].slice(0, 20)

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        filters.searchTerm === '' ||
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const matchesLocation =
        filters.location === '' ||
        filters.location === 'all' ||
        job.location === filters.location

      const matchesJobType =
        filters.jobType.length === 0 || filters.jobType.includes(job.type)

      const matchesSalary =
        job.salary.min >= filters.salaryRange[0] &&
        job.salary.max <= filters.salaryRange[1]

      const matchesExperience =
        filters.experience.length === 0 ||
        filters.experience.includes(job.experience)

      const matchesSkills =
        filters.skills.length === 0 ||
        filters.skills.some((skill) => job.skills.includes(skill))

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType &&
        matchesSalary &&
        matchesExperience &&
        matchesSkills
      )
    })

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'company':
          comparison = a.company.localeCompare(b.company)
          break
        case 'date':
          comparison =
            new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
          break
        case 'salary':
          comparison = a.salary.min - b.salary.min
          break
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [jobs, filters])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage)
  const paginatedJobs = filteredAndSortedJobs.slice(
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
      location: '',
      jobType: [],
      salaryRange: [0, 200000],
      experience: [],
      skills: [],
      sortBy: 'date',
      sortOrder: 'desc',
    })
    setCurrentPage(1)
  }

  const formatSalary = (salary: {
    min: number
    max: number
    currency: string
  }) => {
    return `$${(salary.min / 1000).toFixed(0)}k - $${(
      salary.max / 1000
    ).toFixed(0)}k`
  }

  const getJobTypeColor = (type: string) => {
    const colors = {
      'full-time': 'default',
      'part-time': 'secondary',
      contract: 'outline',
      remote: 'destructive',
    } as const
    return colors[type as keyof typeof colors] || 'outline'
  }

  const activeFiltersCount =
    filters.jobType.length +
    filters.experience.length +
    filters.skills.length +
    (filters.location && filters.location !== 'all' ? 1 : 0) +
    (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000 ? 1 : 0)

  const sortOptions = [
    { value: 'date', label: 'Posted Date' },
    { value: 'title', label: 'Job Title' },
    { value: 'company', label: 'Company' },
    { value: 'salary', label: 'Salary' },
  ]

  const getActiveFilters = () => {
    const activeFilters = []

    filters.jobType.forEach((type) => {
      activeFilters.push({
        id: `jobtype-${type}`,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
      })
    })

    filters.experience.forEach((exp) => {
      activeFilters.push({
        id: `experience-${exp}`,
        label: exp,
        value: exp,
      })
    })

    filters.skills.forEach((skill) => {
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

    if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) {
      activeFilters.push({
        id: 'salary',
        label: `💰 $${(filters.salaryRange[0] / 1000).toFixed(0)}k - $${(
          filters.salaryRange[1] / 1000
        ).toFixed(0)}k`,
        value: 'salary',
      })
    }

    return activeFilters
  }

  const handleRemoveFilter = (filterId: string) => {
    if (filterId.startsWith('jobtype-')) {
      const type = filterId.replace('jobtype-', '')
      updateFilter(
        'jobType',
        filters.jobType.filter((t) => t !== type)
      )
    } else if (filterId.startsWith('experience-')) {
      const exp = filterId.replace('experience-', '')
      updateFilter(
        'experience',
        filters.experience.filter((e) => e !== exp)
      )
    } else if (filterId.startsWith('skill-')) {
      const skill = filterId.replace('skill-', '')
      updateFilter(
        'skills',
        filters.skills.filter((s) => s !== skill)
      )
    } else if (filterId === 'location') {
      updateFilter('location', '')
    } else if (filterId === 'salary') {
      updateFilter('salaryRange', [0, 200000])
    }
  }

  return (
    <div className="min-h-screen  p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold ">
              Job Board
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredAndSortedJobs.length} of {jobs.length} jobs found
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href={Routes.JOBS}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter Header */}
        <SearchFilterHeader
          searchPlaceholder="Search jobs by title, company, or description..."
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
          title="Job Filters"
          description="Filter jobs by your preferences"
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        >
          {/* Quick Actions */}
          <div className="flex justify-end">
            <Button onClick={clearFilters} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          <Separator />

          {/* Location Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">📍 Location</Label>
            <Select
              value={filters.location}
              onValueChange={(value) => updateFilter('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Job Type Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">💼 Job Type</Label>
            <div className="grid grid-cols-1 gap-3">
              {uniqueJobTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`jobtype-${type}`}
                    checked={filters.jobType.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('jobType', [...filters.jobType, type])
                      } else {
                        updateFilter(
                          'jobType',
                          filters.jobType.filter((t) => t !== type)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={`jobtype-${type}`}
                    className="text-sm font-normal capitalize"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Salary Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              💰 Salary Range: ${(filters.salaryRange[0] / 1000).toFixed(0)}k -
              ${(filters.salaryRange[1] / 1000).toFixed(0)}k
            </Label>
            <Slider
              value={filters.salaryRange}
              onValueChange={(value) => updateFilter('salaryRange', value)}
              max={200000}
              min={0}
              step={10000}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Experience Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              🎓 Experience Level
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {uniqueExperience.map((exp) => (
                <div key={exp} className="flex items-center space-x-2">
                  <Checkbox
                    id={`experience-${exp}`}
                    checked={filters.experience.includes(exp)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('experience', [...filters.experience, exp])
                      } else {
                        updateFilter(
                          'experience',
                          filters.experience.filter((e) => e !== exp)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={`experience-${exp}`}
                    className="text-sm font-normal"
                  >
                    {exp}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Skills Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">🛠️ Skills</Label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {uniqueSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={filters.skills.includes(skill)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('skills', [...filters.skills, skill])
                      } else {
                        updateFilter(
                          'skills',
                          filters.skills.filter((s) => s !== skill)
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
        </FilterDrawer>

        {/* Job Listings */}
        <div className="space-y-4">
          {paginatedJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <Badge
                        variant={getJobTypeColor(job.type)}
                        className="w-fit capitalize"
                      >
                        {job.type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 5).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                    <Link href={`${Routes.JOB_DETAILS.replace(':id', job.id)}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Link href={`${Routes.JOB_CANDIDATES.replace(':id', job.id)}`}>
                      <Button size="sm" className="w-full sm:w-auto">
                        <Search className="h-4 w-4 mr-2" />
                        Find Candidates
                      </Button>
                    </Link>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedJobs.length
                  )}{' '}
                  of {filteredAndSortedJobs.length} jobs
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
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
                        className="hidden sm:inline-flex"
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
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {filteredAndSortedJobs.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                No jobs found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4 bg-transparent"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
