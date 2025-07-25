'use client'
import FileUpload from '@/components/file-upload'
import { Routes } from '@/constants/routes'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export interface ProcessedResume {
  id: string
  fileName: string
  uploadDate: string
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  experience: Array<{
    company: string
    position: string
    duration: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    year: string
  }>
  skills: string[]
  summary: string
  experienceYears: number
  industryCategory: string
}
export interface OutputConfig {
  includePersonalInfo: boolean
  includeExperience: boolean
  includeEducation: boolean
  includeSkills: boolean
  includeSummary: boolean
  customFields: string[]
}

export default function Home() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const [outputConfig, setOutputConfig] = useState<OutputConfig>({
    includePersonalInfo: true,
    includeExperience: true,
    includeEducation: true,
    includeSkills: true,
    includeSummary: true,
    customFields: [],
  })
  const handleFilesUploaded = async (files: File[]) => {
    setIsProcessing(true)

    try {
      console.log(
        'Files received:',
        files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
      )

      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file)
      })
      formData.append('outputConfig', JSON.stringify(outputConfig))

      console.log('Output config being sent:', outputConfig)

      const response = await axios.post('/api/process-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status !== 200) {
        throw new Error(
          `Failed to process resumes: ${response.status} ${response.statusText}`
        )
      }

      toast.success('Data processed successfully', {
        description: 'Your files are being processed in the background',
        action: {
          label: 'View Progress',
          onClick: () => router.push(Routes.STATUS),
        },
        duration: 10000,
      })
    } catch (error) {
      console.error('Error processing resumes:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data)
        console.error('Response status:', error.response?.status)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <FileUpload
        onFilesUploaded={handleFilesUploaded}
        isProcessing={isProcessing}
        outputConfig={outputConfig}
        onConfigChange={setOutputConfig}
      />
    </div>
  )
}
