export interface ProcessingJob {
  id: string
  filename: string
  original_size: number
  file_type: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  stage:
    | 'upload'
    | 'validation'
    | 'extraction'
    | 'enhancement'
    | 'finalization'
    | 'completed'
  progress: number
  error_message?: string
  created_at: string
  updated_at: string
  completed_at?: string
  processing_time?: number
  result_data?: any
  user_id?: string
}

export interface ProcessingStage {
  name: string
  description: string
  icon: string
  estimatedTime: number
}

export const PROCESSING_STAGES: ProcessingStage[] = [
  {
    name: 'upload',
    description: 'File uploaded and queued',
    icon: '📤',
    estimatedTime: 1,
  },
  {
    name: 'validation',
    description: 'Validating file format and content',
    icon: '🔍',
    estimatedTime: 5,
  },
  {
    name: 'extraction',
    description: 'Extracting text and data from file',
    icon: '📄',
    estimatedTime: 15,
  },
  {
    name: 'enhancement',
    description: 'AI processing and enhancement',
    icon: '🤖',
    estimatedTime: 30,
  },
  {
    name: 'finalization',
    description: 'Finalizing and saving results',
    icon: '✨',
    estimatedTime: 5,
  },
  {
    name: 'completed',
    description: 'Processing completed successfully',
    icon: '✅',
    estimatedTime: 0,
  },
]

export type Permission = 'read' | 'write' | 'delete' | 'admin'

export type Permissions = {
  [resource: string]: Permission[]
}

export type UserWithPermissions = {
  id: string
  email: string
  name?: string
  role: 'user' | 'admin'
  permissions: Permissions
}
