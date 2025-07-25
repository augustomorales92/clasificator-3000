'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGeminiTasks } from '@/hooks/use-gemini-tasks'
import { ArrowLeft, Copy, Download, Edit, Share } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState } from 'react'

interface PageProps {
  id: string
}

export default function PrescriptionDetailsPage({ id }: PageProps) {
  const [copied, setCopied] = useState(false)
  const { task } = useGeminiTasks(id)

  if (!task) {
    notFound()
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const downloadText = (text: string, fileName: string) => {
    const element = document.createElement('a')
    const file = new Blob([text], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${fileName}_extracted.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getWordCount = (text: string | null) => {
    if (!text) return 0
    return text.trim().split(/\s+/).length
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }

  const wordCount = getWordCount(task.ocrResultText)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/prescriptions">
            <Button variant="outline" size="sm" className="mb-4 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {task.serviceName || 'Sin título'}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-green-600">
                  {task.confidence ? `${Math.round(task.confidence)}%` : 'N/A'}{' '}
                  confianza
                </Badge>
                <span className="text-sm text-gray-500">
                  Tiempo de procesamiento:{' '}
                  {task.processingTime
                    ? `${task.processingTime.toFixed(2)}s`
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  task.ocrResultText && copyToClipboard(task.ocrResultText)
                }
                disabled={!task.ocrResultText}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copiado!' : 'Copiar todo'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  task.ocrResultText &&
                  downloadText(task.ocrResultText, task.id)
                }
                disabled={!task.ocrResultText}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Imagen original */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Imagen Original</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white">
                <Image
                  src={task.inputUrl || '/placeholder.svg'}
                  alt={task.serviceName || 'Imagen'}
                  className="w-full h-auto max-h-[600px] object-contain"
                  width={100}
                  height={100}
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Modelo: {task.modelUsed || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Texto extraído */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Texto Extraído</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {task.ocrResultText || 'No hay texto extraído'}
                </pre>
              </div>

              {/* Estadísticas */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {task.confidence
                      ? `${Math.round(task.confidence)}%`
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-blue-800">Confianza</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {wordCount}
                  </div>
                  <div className="text-sm text-green-800">Palabras</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {task.ocrResultText?.length || 0}
                  </div>
                  <div className="text-sm text-purple-800">Caracteres</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Información del Procesamiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Servicio:
                </span>
                <p className="text-sm text-gray-900">
                  {task.serviceName || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Confianza:
                </span>
                <p className="text-sm text-gray-900">
                  {task.confidence ? `${Math.round(task.confidence)}%` : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Palabras detectadas:
                </span>
                <p className="text-sm text-gray-900">{wordCount}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Tiempo de procesamiento:
                </span>
                <p className="text-sm text-gray-900">
                  {task.processingTime
                    ? `${task.processingTime.toFixed(2)}s`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
