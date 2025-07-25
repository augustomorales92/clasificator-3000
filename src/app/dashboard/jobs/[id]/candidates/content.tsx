'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Routes } from '@/constants/routes'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Download,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  Star,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  skills: string[]
  experience: string
  requirements: string[]
}

interface CandidateMatch {
  id: string
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  filename: string
  uploadDate: string
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  experienceMatch: boolean
  summary: string
  experience: string[]
  education: string[]
  skills: string[]
  reasons: string[]
  availability: 'immediate' | '2-weeks' | '1-month' | 'negotiable'
  salaryExpectation?: string
}

// Mock job data
const getJobById = (id: string): JobPosting | null => {
  const mockJobs: Record<string, JobPosting> = {
    '1': {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
      experience: '5+ years',
      requirements: [
        "Bachelor's degree in Computer Science",
        '5+ years of experience',
        'Strong problem-solving skills',
      ],
    },
    '2': {
      id: '2',
      title: 'Product Manager',
      company: 'InnovateLab',
      location: 'New York, NY',
      skills: [
        'Product Strategy',
        'Agile',
        'Scrum',
        'Analytics',
        'User Research',
        'Roadmapping',
      ],
      experience: '3+ years',
      requirements: [
        'MBA or equivalent experience',
        '3+ years in product management',
        'Strong analytical skills',
      ],
    },
  }
  return mockJobs[id] || null
}

// Mock candidate matches
const getCandidateMatches = (jobId: string): CandidateMatch[] => {
  const mockMatches: Record<string, CandidateMatch[]> = {
    '1': [
      {
        id: '1',
        personalInfo: {
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
        },
        filename: 'john_smith_resume.pdf',
        uploadDate: '2024-01-20',
        matchScore: 95,
        matchedSkills: [
          'JavaScript',
          'React',
          'Node.js',
          'Python',
          'AWS',
          'Docker',
        ],
        missingSkills: [],
        experienceMatch: true,
        summary:
          'Senior software engineer with 7 years of experience in full-stack development and cloud technologies.',
        experience: [
          'Senior Software Engineer at TechCorp (2020-Present)',
          'Software Engineer at StartupXYZ (2018-2020)',
          'Junior Developer at WebCorp (2017-2018)',
        ],
        education: ['Bachelor of Computer Science - MIT (2017)'],
        skills: [
          'JavaScript',
          'React',
          'Node.js',
          'Python',
          'AWS',
          'Docker',
          'TypeScript',
          'GraphQL',
        ],
        reasons: [
          'Perfect skill match for all required technologies',
          'Experience level exceeds job requirements',
          'Located in the same city',
          'Strong background in similar companies',
        ],
        availability: '2-weeks',
        salaryExpectation: '$140k - $160k',
      },
      {
        id: '2',
        personalInfo: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 987-6543',
          location: 'Seattle, WA',
        },
        filename: 'sarah_johnson_cv.pdf',
        uploadDate: '2024-01-19',
        matchScore: 88,
        matchedSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        missingSkills: ['Docker'],
        experienceMatch: true,
        summary:
          'Full-stack developer with 6 years of experience building scalable web applications.',
        experience: [
          'Lead Developer at CloudTech (2021-Present)',
          'Full-Stack Developer at DataFlow (2019-2021)',
          'Frontend Developer at WebSolutions (2018-2019)',
        ],
        education: ['Bachelor of Software Engineering - Stanford (2018)'],
        skills: [
          'JavaScript',
          'React',
          'Node.js',
          'Python',
          'AWS',
          'MongoDB',
          'Redux',
        ],
        reasons: [
          'Strong match for most required skills',
          'Excellent experience level',
          'Leadership experience as Lead Developer',
          'Open to relocation',
        ],
        availability: '1-month',
        salaryExpectation: '$130k - $150k',
      },
      {
        id: '3',
        personalInfo: {
          name: 'Michael Brown',
          email: 'michael.brown@email.com',
          phone: '+1 (555) 456-7890',
          location: 'Austin, TX',
        },
        filename: 'michael_brown_resume.pdf',
        uploadDate: '2024-01-18',
        matchScore: 72,
        matchedSkills: ['JavaScript', 'React', 'Python'],
        missingSkills: ['Node.js', 'AWS', 'Docker'],
        experienceMatch: true,
        summary:
          'Software developer with 5 years of experience, specializing in frontend development and Python.',
        experience: [
          'Senior Frontend Developer at TechStart (2020-Present)',
          'Frontend Developer at WebCorp (2019-2020)',
          'Junior Developer at LocalTech (2018-2019)',
        ],
        education: ['Bachelor of Computer Science - UT Austin (2018)'],
        skills: [
          'JavaScript',
          'React',
          'Python',
          'Vue.js',
          'Django',
          'PostgreSQL',
        ],
        reasons: [
          'Good match for frontend technologies',
          'Meets experience requirements',
          'Strong Python background',
          'Willing to learn missing technologies',
        ],
        availability: 'immediate',
        salaryExpectation: '$110k - $130k',
      },
      {
        id: '4',
        personalInfo: {
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          phone: '+1 (555) 321-0987',
          location: 'Remote',
        },
        filename: 'emily_davis_cv.pdf',
        uploadDate: '2024-01-17',
        matchScore: 65,
        matchedSkills: ['JavaScript', 'React', 'Node.js'],
        missingSkills: ['Python', 'AWS', 'Docker'],
        experienceMatch: false,
        summary:
          'Frontend-focused developer with 3 years of experience, eager to expand into full-stack development.',
        experience: [
          'Frontend Developer at RemoteFirst (2021-Present)',
          'Junior Frontend Developer at StartupHub (2020-2021)',
        ],
        education: ['Bachelor of Web Development - Online University (2020)'],
        skills: [
          'JavaScript',
          'React',
          'Node.js',
          'HTML/CSS',
          'Sass',
          'Webpack',
        ],
        reasons: [
          'Strong frontend skills with React',
          'Some backend experience with Node.js',
          'Remote work experience',
          'Motivated to learn new technologies',
        ],
        availability: 'negotiable',
        salaryExpectation: '$90k - $110k',
      },
    ],
    '2': [
      {
        id: '5',
        personalInfo: {
          name: 'David Wilson',
          email: 'david.wilson@email.com',
          phone: '+1 (555) 654-3210',
          location: 'New York, NY',
        },
        filename: 'david_wilson_resume.pdf',
        uploadDate: '2024-01-16',
        matchScore: 92,
        matchedSkills: [
          'Product Strategy',
          'Agile',
          'Scrum',
          'Analytics',
          'User Research',
          'Roadmapping',
        ],
        missingSkills: [],
        experienceMatch: true,
        summary:
          'Product manager with 5 years of experience driving product strategy and user-centered design.',
        experience: [
          'Senior Product Manager at TechFlow (2021-Present)',
          'Product Manager at InnovateNow (2019-2021)',
          'Associate Product Manager at StartupLab (2018-2019)',
        ],
        education: [
          'MBA - Wharton (2018)',
          'Bachelor of Engineering - Columbia (2016)',
        ],
        skills: [
          'Product Strategy',
          'Agile',
          'Scrum',
          'Analytics',
          'User Research',
          'Roadmapping',
          'A/B Testing',
        ],
        reasons: [
          'Perfect skill alignment with job requirements',
          'Excellent experience level',
          'Located in target city',
          'Strong track record in product management',
        ],
        availability: '1-month',
        salaryExpectation: '$120k - $140k',
      },
    ],
  }
  return mockMatches[jobId] || []
}

export default function JobCandidatesContent({ id }: { id: string }) {
  const [job, setJob] = useState<JobPosting | null>(null)
  const [candidates, setCandidates] = useState<CandidateMatch[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<
    'score' | 'name' | 'experience' | 'location'
  >('score')
  const [filterByScore, setFilterByScore] = useState<
    'all' | 'excellent' | 'good' | 'fair'
  >('all')

  useEffect(() => {
    const jobData = getJobById(id)
    const candidateData = getCandidateMatches(id)
    setJob(jobData)
    setCandidates(candidateData)
  }, [id])

  const filteredAndSortedCandidates = useMemo(() => {
    const filtered = candidates.filter((candidate) => {
      const matchesSearch =
        searchTerm === '' ||
        candidate.personalInfo.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        candidate.personalInfo.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )

      const matchesScore =
        filterByScore === 'all' ||
        (filterByScore === 'excellent' && candidate.matchScore >= 80) ||
        (filterByScore === 'good' &&
          candidate.matchScore >= 60 &&
          candidate.matchScore < 80) ||
        (filterByScore === 'fair' && candidate.matchScore < 60)

      return matchesSearch && matchesScore
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.matchScore - a.matchScore
        case 'name':
          return a.personalInfo.name.localeCompare(b.personalInfo.name)
        case 'experience':
          return b.experience.length - a.experience.length
        case 'location':
          return a.personalInfo.location.localeCompare(b.personalInfo.location)
        default:
          return 0
      }
    })

    return filtered
  }, [candidates, searchTerm, sortBy, filterByScore])

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Job not found</p>
            <Link href={Routes.JOBS}>
              <Button variant="outline" className="mt-4 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMatchScoreBadge = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'immediate':
        return 'bg-green-100 text-green-800'
      case '2-weeks':
        return 'bg-blue-100 text-blue-800'
      case '1-month':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const excellentMatches = candidates.filter((c) => c.matchScore >= 80).length
  const goodMatches = candidates.filter(
    (c) => c.matchScore >= 60 && c.matchScore < 80
  ).length
  const totalCandidates = candidates.length

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Candidate Matches
            </h1>
            <p className="text-gray-600 mt-1">
              {job.title} at {job.company}
            </p>
          </div>
        </div>

        {/* Job Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Required Skills
                </Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Experience
                </Label>
                <p className="text-sm mt-1">{job.experience}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Location
                </Label>
                <p className="text-sm mt-1">{job.location}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Total Candidates
                </Label>
                <p className="text-sm mt-1">{totalCandidates} found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {excellentMatches}
              </div>
              <p className="text-sm text-gray-600">Excellent Matches (80%+)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {goodMatches}
              </div>
              <p className="text-sm text-gray-600">Good Matches (60-79%)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {totalCandidates}
              </div>
              <p className="text-sm text-gray-600">Total Candidates</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates by name, location, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: any) => setSortBy(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Sort by Match Score</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="experience">Sort by Experience</SelectItem>
                  <SelectItem value="location">Sort by Location</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterByScore}
                onValueChange={(value: any) => setFilterByScore(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Matches</SelectItem>
                  <SelectItem value="excellent">Excellent (80%+)</SelectItem>
                  <SelectItem value="good">Good (60-79%)</SelectItem>
                  <SelectItem value="fair">Fair (&lt;60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Candidate List */}
        <div className="space-y-4">
          {filteredAndSortedCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Candidate Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {candidate.personalInfo.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{candidate.personalInfo.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{candidate.personalInfo.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{candidate.personalInfo.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span
                            className={`text-2xl font-bold ${getMatchScoreColor(
                              candidate.matchScore
                            )}`}
                          >
                            {candidate.matchScore}%
                          </span>
                        </div>
                        <Badge
                          variant={getMatchScoreBadge(candidate.matchScore)}
                        >
                          {candidate.matchScore >= 80
                            ? 'Excellent'
                            : candidate.matchScore >= 60
                            ? 'Good'
                            : 'Fair'}{' '}
                          Match
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Progress value={candidate.matchScore} className="h-2" />

                      <p className="text-gray-700 text-sm">
                        {candidate.summary}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Matched Skills */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Label className="text-sm font-medium text-green-700">
                              Matched Skills ({candidate.matchedSkills.length})
                            </Label>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {candidate.matchedSkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="default"
                                className="text-xs bg-green-100 text-green-800"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Missing Skills */}
                        {candidate.missingSkills.length > 0 && (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              <Label className="text-sm font-medium text-orange-700">
                                Missing Skills ({candidate.missingSkills.length}
                                )
                              </Label>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {candidate.missingSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs text-orange-600 border-orange-200"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-600">Availability</Label>
                          <Badge
                            className={`mt-1 ${getAvailabilityColor(
                              candidate.availability
                            )} capitalize`}
                          >
                            {candidate.availability}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-gray-600">Experience</Label>
                          <p className="mt-1">
                            {candidate.experience.length} positions
                          </p>
                        </div>
                        {candidate.salaryExpectation && (
                          <div>
                            <Label className="text-gray-600">
                              Salary Expectation
                            </Label>
                            <p className="mt-1">
                              {candidate.salaryExpectation}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Match Reasons */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Why this candidate?
                        </Label>
                        <ul className="space-y-1">
                          {candidate.reasons
                            .slice(0, 2)
                            .map((reason, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2"
                              >
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-gray-600">
                                  {reason}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Candidate
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Resume
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedCandidates.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">
                No candidates found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setFilterByScore('all')
                }}
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
