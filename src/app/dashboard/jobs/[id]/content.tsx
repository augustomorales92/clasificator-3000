'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Routes } from '@/constants/routes'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Share2,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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

// Mock data - in a real app this would come from an API
const getJobById = (id: string): JobPosting | null => {
  const mockJobs: Record<string, JobPosting> = {
    '1': {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 120000, max: 180000, currency: 'USD' },
      description: `We are looking for a senior software engineer to join our growing team. You will be responsible for designing and implementing scalable web applications using modern technologies.

Key Responsibilities:
• Design and develop high-quality software solutions
• Collaborate with cross-functional teams to define and implement new features
• Mentor junior developers and contribute to technical decisions
• Participate in code reviews and maintain coding standards
• Optimize application performance and scalability

What We Offer:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote work options
• Professional development opportunities
• Modern office space with state-of-the-art equipment`,
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        '5+ years of professional software development experience',
        'Strong problem-solving and analytical skills',
        'Experience with agile development methodologies',
        'Excellent communication and teamwork skills',
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
      experience: '5+ years',
      postedDate: '2024-01-20',
      applicationDeadline: '2024-02-20',
      contactEmail: 'hiring@techcorp.com',
      isActive: true,
    },
    '2': {
      id: '2',
      title: 'Product Manager',
      company: 'InnovateLab',
      location: 'New York, NY',
      type: 'full-time',
      salary: { min: 100000, max: 140000, currency: 'USD' },
      description: `Join our product team to drive the development of cutting-edge solutions. You will work closely with engineering and design teams to deliver exceptional user experiences.

Key Responsibilities:
• Define product strategy and roadmap
• Gather and prioritize product requirements
• Work closely with engineering teams to deliver products
• Analyze market trends and competitive landscape
• Collaborate with stakeholders across the organization

What We Offer:
• Competitive compensation package
• Stock options and performance bonuses
• Health and wellness benefits
• Learning and development budget
• Collaborative and innovative work environment`,
      requirements: [
        'MBA or equivalent experience in product management',
        '3+ years of product management experience',
        'Strong analytical and data-driven decision making skills',
        'Experience with product management tools (Jira, Confluence, etc.)',
        'Excellent presentation and communication skills',
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
  }

  return mockJobs[id] || null
}

export default function JobDetailContent({ id }: { id: string }) {
  const [job, setJob] = useState<JobPosting | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const jobData = getJobById(id)
    setJob(jobData)
  }, [id])

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Job Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {job.title}
                    </h1>
                    <Badge
                      variant={getJobTypeColor(job.type)}
                      className="w-fit capitalize"
                    >
                      {job.type}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>{formatSalary(job.salary)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{job.experience}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Posted {format(new Date(job.postedDate), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                  {job.applicationDeadline && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Deadline{' '}
                        {format(
                          new Date(job.applicationDeadline),
                          'MMMM dd, yyyy'
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                <Link href={`${Routes.JOB_CANDIDATES.replace(':id', job.id)}`}>
                  <Button size="lg" className="w-full sm:w-auto">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Find Candidates
                  </Button>
                </Link>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={
                      isBookmarked
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-transparent'
                    }
                  >
                    <Bookmark
                      className={`h-4 w-4 ${
                        isBookmarked ? 'fill-blue-500 text-blue-500' : ''
                      }`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-gray-700">
                    {job.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Job Type
                  </Label>
                  <p className="text-sm mt-1 capitalize">{job.type}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Experience Level
                  </Label>
                  <p className="text-sm mt-1">{job.experience}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Salary Range
                  </Label>
                  <p className="text-sm mt-1">{formatSalary(job.salary)}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Location
                  </Label>
                  <p className="text-sm mt-1">{job.location}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Contact
                  </Label>
                  <p className="text-sm mt-1">{job.contactEmail}</p>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {job.company} is a leading technology company focused on
                  innovation and excellence. We're committed to creating an
                  inclusive workplace where talented individuals can thrive and
                  make a meaningful impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
