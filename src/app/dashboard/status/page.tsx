'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Routes } from '@/constants/routes'
import { useTasksRealtime } from '@/hooks/use-task-realtime'
import type { Task } from '@/lib/schema'
import { format, formatDistanceToNow } from 'date-fns'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function StatusTrackingPage() {
  const { tasks, loading, retryTask, cancelTask, deleteTask } =
    useTasksRealtime()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('all')

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = (task.serviceName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'active' &&
          ['queue', 'processing'].includes(task.status)) ||
        (activeTab === 'completed' && task.status === 'completed') ||
        (activeTab === 'failed' && task.status === 'failed')

      return matchesSearch && matchesStatus && matchesTab
    })
  }, [tasks, searchTerm, statusFilter, activeTab])

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length
    const queue = tasks.filter((task) => task.status === 'queue').length
    const processing = tasks.filter(
      (task) => task.status === 'processing'
    ).length
    const completed = tasks.filter((task) => task.status === 'completed').length
    const failed = tasks.filter((task) => task.status === 'failed').length
    const active = queue + processing

    return { total, queue, processing, completed, failed, active }
  }, [tasks])

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'queue':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: Task['status']) => {
    const colors = {
      queue: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
    }

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleRetry = async (jobId: string) => {
    await retryTask(jobId)
  }

  const handleCancel = async (jobId: string) => {
    await cancelTask(jobId)
  }

  const handleDelete = async (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      await deleteTask(jobId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">
              Loading processing status...
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Processing Status
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor your file processing workflow in real-time
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Jobs
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.active}
                  </p>
                </div>
                <Loader2 className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Queue</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.queue}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.failed}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by service name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="queue">Queue</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({stats.completed})
            </TabsTrigger>
            <TabsTrigger value="failed">Failed ({stats.failed})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(job.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {job.serviceName}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>
                              {job.createdAt
                                ? formatDistanceToNow(new Date(job.createdAt), {
                                    addSuffix: true,
                                  })
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(job.status)}
                      </div>
                    </div>

                    {/* Error Message */}
                    {job.status === 'failed' && job.errorMessage && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              Processing Error
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                              {job.errorMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Processing Time */}
                    {job.status === 'completed' &&
                      job.finishedAt &&
                      job.startedAt && (
                        <div className="mb-4 text-sm text-gray-600">
                          <span className="font-medium">Processing time:</span>{' '}
                          {(
                            (new Date(job.finishedAt).getTime() -
                              new Date(job.startedAt).getTime()) /
                            1000
                          ).toFixed(2)}
                          s
                        </div>
                      )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Created:{' '}
                        {job.createdAt
                          ? format(
                              new Date(job.createdAt),
                              'MMM dd, yyyy HH:mm'
                            )
                          : 'N/A'}
                        {job.finishedAt && (
                          <span className="ml-4">
                            Completed:{' '}
                            {format(
                              new Date(job.finishedAt),
                              'MMM dd, yyyy HH:mm'
                            )}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {job.status === 'completed' && (
                          <Link
                            href={Routes.PRESCRIPTION_DETAILS.replace(
                              ':id',
                              job.id
                            )}
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                          </Link>
                        )}

                        {job.status === 'failed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(job.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                          </Button>
                        )}

                        {job.status === 'processing' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(job.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredJobs.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'No processing jobs have been submitted yet'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
