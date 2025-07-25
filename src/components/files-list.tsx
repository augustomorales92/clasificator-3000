'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/i18n-context'
import { File, Loader2, Trash2, Upload } from 'lucide-react'

interface FilesListProps {
  selectedFiles: File[]
  isProcessing: boolean
  onRemoveFile: (index: number) => void
  onUpload: () => void
}

export default function FilesList({
  selectedFiles,
  isProcessing,
  onRemoveFile,
  onUpload,
}: FilesListProps) {
  const { t } = useI18n()
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {t('filesList.selectedFiles', { count: selectedFiles.length })}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full flex flex-col justify-between">
        <div className="space-y-2 overflow-y-auto">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
            >
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-gray-400">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
                  disabled={isProcessing}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full" onClick={onUpload} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('filesList.processing')}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {t('filesList.upload')}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
