'use client'

import type { ProcessedResume } from '@/app/dashboard/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Download, Mail, MapPin, Phone } from 'lucide-react'

interface ResumeDetailModalProps {
  resume: ProcessedResume
  isOpen: boolean
  onClose: () => void
}

export default function ResumeDetailModal({
  resume,
  isOpen,
  onClose,
}: ResumeDetailModalProps) {
  const downloadResume = () => {
    // En una app real, esto descargaría el archivo original
    alert(`Descargando ${resume.fileName}...`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pt-4">
            <DialogTitle className="text-2xl">
              {resume.personalInfo.name}
            </DialogTitle>
            <Button onClick={downloadResume} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{resume.personalInfo.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{resume.personalInfo.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{resume.personalInfo.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{resume.industryCategory}</Badge>
              <Badge variant="outline">
                {resume.experienceYears} años de exp
              </Badge>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Resumen Profesional</h3>
            <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Experiencia Laboral</h3>
            <div className="space-y-4">
              {resume.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {exp.position}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {exp.duration}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {exp.company}
                  </div>
                  <p className="text-sm text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Educación</h3>
            <div className="space-y-3">
              {resume.education.map((edu, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <div className="font-medium">{edu.degree}</div>
                    <div className="text-sm text-gray-600">
                      {edu.institution}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{edu.year}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* File Info */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Archivo: {resume.fileName}</span>
              <span>Subido: {resume.uploadDate}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
