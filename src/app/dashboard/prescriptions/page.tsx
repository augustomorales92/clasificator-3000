'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Routes } from '@/constants/routes'
import { useGeminiTasks } from '@/hooks/use-gemini-tasks'
import { ArrowUpDown, Eye, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PrescriptionsList() {
  const { tasks, isLoading, error } = useGeminiTasks()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = tasks.filter((item) =>
    !searchTerm
      ? true
      : (item.ocrResultText?.toLowerCase() || '').includes(
          searchTerm.toLowerCase()
        ) ||
        (item.serviceName?.toLowerCase() || '').includes(
          searchTerm.toLowerCase()
        )
  )

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500">
          Error al cargar los datos: {error.message}
        </p>
      </Card>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lista de Textos Extraídos
        </h1>
        <p className="text-gray-600">
          {filteredData.length} de {tasks.length} textos encontrados
        </p>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por contenido o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Ordenar por Fecha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de textos extraídos */}
      <div className="space-y-4">
        {isLoading
          ? // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : filteredData.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.serviceName}
                        </h3>
                        <Badge variant="outline" className="text-green-600">
                          {((item.confidence ?? 0) * 100).toFixed(1)}% confianza
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Modelo:{' '}
                          </span>
                          <span className="text-sm text-gray-900">
                            {item.modelUsed || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Tiempo:{' '}
                          </span>
                          <span className="text-sm text-gray-900">
                            {(item.processingTime ?? 0).toFixed(2)}s
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Creado:{' '}
                          </span>
                          <span className="text-sm text-gray-900">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                        {item.ocrResultText?.slice(0, 200)}...
                      </p>
                    </div>

                    <div className="ml-4">
                      <Link
                        href={`${Routes.PRESCRIPTION_DETAILS.replace(
                          ':id',
                          item.id
                        )}`}
                      >
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {!isLoading && filteredData.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            No se encontraron textos que coincidan con los filtros aplicados.
          </p>
        </Card>
      )}
    </div>
  )
}
