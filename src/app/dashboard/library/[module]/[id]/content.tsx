'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Routes } from '@/constants/routes'
import { format } from 'date-fns'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  Maximize2,
  RotateCw,
  Share2,
  XCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ProcessedFile {
  id: string
  filename: string
  originalSize: number
  uploadDate: string
  uploadTime: string
  status: 'processing' | 'completed' | 'failed'
  processingTime?: number
  fileType: string
  dimensions: {
    width: number
    height: number
  }
  enhancementTypes: string[]
  originalUrl: string
  processedUrls: {
    enhanced: string
    upscaled: string
    denoised: string
    colorCorrected: string
  }
  processingDetails: {
    aiModel: string
    enhancementLevel: string
    upscaleRatio: string
    colorSpace: string
  }
}

// Mock data - in a real app this would come from an API
const getFileById = (id: string): ProcessedFile | null => {
  const mockFiles: Record<string, ProcessedFile> = {
    '1': {
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
      originalUrl:
        '/placeholder.svg?height=600&width=800&text=Original+Landscape',
      processedUrls: {
        enhanced:
          '/placeholder.svg?height=600&width=800&text=AI+Enhanced+Landscape',
        upscaled:
          '/placeholder.svg?height=600&width=800&text=Upscaled+Landscape',
        denoised:
          '/placeholder.svg?height=600&width=800&text=Denoised+Landscape',
        colorCorrected:
          '/placeholder.svg?height=600&width=800&text=Color+Corrected+Landscape',
      },
      processingDetails: {
        aiModel: 'Enhanced-AI v2.1',
        enhancementLevel: 'High',
        upscaleRatio: '2x',
        colorSpace: 'sRGB',
      },
    },
    '2': {
      id: '2',
      filename: 'portrait_session.png',
      originalSize: 3072000,
      uploadDate: '2024-01-20',
      uploadTime: '12:15:10',
      status: 'completed',
      processingTime: 52,
      fileType: 'PNG',
      dimensions: { width: 1080, height: 1350 },
      enhancementTypes: ['AI Enhancement', 'Upscaling', 'Noise Reduction'],
      originalUrl:
        '/placeholder.svg?height=600&width=800&text=Original+Portrait',
      processedUrls: {
        enhanced:
          '/placeholder.svg?height=600&width=800&text=AI+Enhanced+Portrait',
        upscaled:
          '/placeholder.svg?height=600&width=800&text=Upscaled+Portrait',
        denoised:
          '/placeholder.svg?height=600&width=800&text=Denoised+Portrait',
        colorCorrected:
          '/placeholder.svg?height=600&width=800&text=Color+Corrected+Portrait',
      },
      processingDetails: {
        aiModel: 'Enhanced-AI v2.1',
        enhancementLevel: 'Medium',
        upscaleRatio: '1.5x',
        colorSpace: 'sRGB',
      },
    },
    '3': {
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
      originalUrl: '/placeholder.svg?height=600&width=800&text=Original+Family',
      processedUrls: {
        enhanced:
          '/placeholder.svg?height=600&width=800&text=AI+Enhanced+Family',
        upscaled: '/placeholder.svg?height=600&width=800&text=Upscaled+Family',
        denoised: '/placeholder.svg?height=600&width=800&text=Denoised+Family',
        colorCorrected:
          '/placeholder.svg?height=600&width=800&text=Color+Corrected+Family',
      },
      processingDetails: {
        aiModel: 'Enhanced-AI v2.1',
        enhancementLevel: 'High',
        upscaleRatio: '3x',
        colorSpace: 'Adobe RGB',
      },
    },
  }

  return mockFiles[id] || null
}

export default function FileDetailPage({
  id,
  module,
}: {
  id: string
  module: string
}) {
  const [file, setFile] = useState<ProcessedFile | null>(null)
  const [activeTab, setActiveTab] = useState<string>('original')
  const [zoomLevel, setZoomLevel] = useState(100)

  useEffect(() => {
    const fileData = getFileById(id)
    setFile(fileData)
  }, [id])

  if (!file) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">File not found</p>
            <Link
              href={
                Routes[`${module.toUpperCase()}_LIBRARY` as keyof typeof Routes]
              }
            >
              <Button variant="outline" className="mt-4 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const imageVersions = [
    {
      id: 'original',
      label: 'Original',
      description: 'The original uploaded image',
      url: file.originalUrl,
      icon: '📷',
    },
    {
      id: 'enhanced',
      label: 'AI Enhanced',
      description: 'AI-powered overall enhancement',
      url: file.processedUrls.enhanced,
      icon: '✨',
    },
    {
      id: 'upscaled',
      label: 'Upscaled',
      description: 'Higher resolution version',
      url: file.processedUrls.upscaled,
      icon: '🔍',
    },
    {
      id: 'denoised',
      label: 'Denoised',
      description: 'Noise reduction applied',
      url: file.processedUrls.denoised,
      icon: '🧹',
    },
    {
      id: 'colorCorrected',
      label: 'Color Corrected',
      description: 'Enhanced colors and contrast',
      url: file.processedUrls.colorCorrected,
      icon: '🎨',
    },
  ]

  const currentImage = imageVersions.find((version) => version.id === activeTab)

  const handleDownload = (imageUrl: string, label: string) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading ${label}: ${imageUrl}`)
    // You could implement actual download logic here
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
                {file.filename}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(file.status)}
                <span className="text-sm sm:text-base text-gray-600">
                  Uploaded on{' '}
                  {format(new Date(file.uploadDate), 'MMMM dd, yyyy')} at{' '}
                  {file.uploadTime}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Tabbed Interface */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currentImage?.icon}</span>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">
                        {currentImage?.label}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {currentImage?.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-12 text-center">
                      {zoomLevel}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setZoomLevel(Math.min(200, zoomLevel + 25))
                      }
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:flex bg-transparent"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Maximize2 className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Full Screen</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
                        <div className="relative w-full h-full">
                          <Image
                            src={currentImage?.url || '/placeholder.svg'}
                            alt={`${file.filename} - ${currentImage?.label}`}
                            className="w-full h-full object-contain"
                            width={100}
                            height={100}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tabbed Interface */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-5 h-auto p-1">
                    {imageVersions.map((version) => (
                      <TabsTrigger
                        key={version.id}
                        value={version.id}
                        className="flex flex-col items-center p-2 sm:p-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <span className="text-base sm:text-lg mb-1">
                          {version.icon}
                        </span>
                        <span className="text-xs font-medium text-center leading-tight">
                          {version.label}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Image Display with Integrated Download */}
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-lg border bg-gray-100 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
                      {imageVersions.map((version) => (
                        <TabsContent
                          key={version.id}
                          value={version.id}
                          className="mt-0 w-full relative"
                        >
                          <Image
                            src={version.url || '/placeholder.svg'}
                            alt={`${file.filename} - ${version.label}`}
                            className="w-full h-auto object-contain transition-transform duration-200 max-h-[500px] sm:max-h-[600px]"
                            style={{ transform: `scale(${zoomLevel / 100})` }}
                            width={100}
                            height={100}
                          />
                          {/* Integrated Download Button */}
                          <div className="absolute top-4 right-4">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleDownload(version.url, version.label)
                              }
                              className="bg-white/90 hover:bg-white text-gray-900 shadow-md"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </TabsContent>
                      ))}
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {imageVersions.map((version) => (
                      <button
                        key={version.id}
                        onClick={() => setActiveTab(version.id)}
                        className={`relative aspect-video rounded-lg border-2 overflow-hidden transition-all ${
                          activeTab === version.id
                            ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={version.url || '/placeholder.svg'}
                          alt={version.label}
                          className="w-full h-full object-cover"
                          width={100}
                          height={100}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white font-medium">
                              {version.icon}
                            </span>
                            {activeTab === version.id && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - File Information */}
          <div className="space-y-6">
            {/* File Details */}
            <Card>
              <CardHeader>
                <CardTitle>File Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Status
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(file.status)}
                    <Badge
                      variant={
                        file.status === 'completed'
                          ? 'default'
                          : file.status === 'processing'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {file.status.charAt(0).toUpperCase() +
                        file.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    File Type
                  </Label>
                  <p className="text-sm mt-1">{file.fileType}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    File Size
                  </Label>
                  <p className="text-sm mt-1">
                    {formatFileSize(file.originalSize)}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Dimensions
                  </Label>
                  <p className="text-sm mt-1">
                    {file.dimensions.width} × {file.dimensions.height} pixels
                  </p>
                </div>

                {file.processingTime && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Processing Time
                    </Label>
                    <p className="text-sm mt-1">
                      {file.processingTime} seconds
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Processing Details */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    AI Model
                  </Label>
                  <p className="text-sm mt-1">
                    {file.processingDetails.aiModel}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Enhancement Level
                  </Label>
                  <p className="text-sm mt-1">
                    {file.processingDetails.enhancementLevel}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Upscale Ratio
                  </Label>
                  <p className="text-sm mt-1">
                    {file.processingDetails.upscaleRatio}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Color Space
                  </Label>
                  <p className="text-sm mt-1">
                    {file.processingDetails.colorSpace}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
