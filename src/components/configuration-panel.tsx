'use client'

import type { OutputConfig } from '@/app/dashboard/page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface ConfigurationPanelProps {
  outputConfig: OutputConfig
  onConfigChange: (config: OutputConfig) => void
}

export default function ConfigurationPanel({
  outputConfig,
  onConfigChange,
}: ConfigurationPanelProps) {
  const [newCustomField, setNewCustomField] = useState('')

  const updateConfig = (key: keyof OutputConfig, value: any) => {
    onConfigChange({ ...outputConfig, [key]: value })
  }

  const addCustomField = () => {
    if (
      newCustomField.trim() &&
      !outputConfig.customFields.includes(newCustomField.trim())
    ) {
      updateConfig('customFields', [
        ...outputConfig.customFields,
        newCustomField.trim(),
      ])
      setNewCustomField('')
    }
  }

  const removeCustomField = (field: string) => {
    updateConfig(
      'customFields',
      outputConfig.customFields.filter((f) => f !== field)
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Output Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Standard Fields */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            Include Standard Fields
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="personalInfo"
                checked={outputConfig.includePersonalInfo}
                onCheckedChange={(checked) =>
                  updateConfig('includePersonalInfo', checked)
                }
              />
              <Label htmlFor="personalInfo">Personal Information</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="experience"
                checked={outputConfig.includeExperience}
                onCheckedChange={(checked) =>
                  updateConfig('includeExperience', checked)
                }
              />
              <Label htmlFor="experience">Work Experience</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="education"
                checked={outputConfig.includeEducation}
                onCheckedChange={(checked) =>
                  updateConfig('includeEducation', checked)
                }
              />
              <Label htmlFor="education">Education</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="skills"
                checked={outputConfig.includeSkills}
                onCheckedChange={(checked) =>
                  updateConfig('includeSkills', checked)
                }
              />
              <Label htmlFor="skills">Skills</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="summary"
                checked={outputConfig.includeSummary}
                onCheckedChange={(checked) =>
                  updateConfig('includeSummary', checked)
                }
              />
              <Label htmlFor="summary">Summary</Label>
            </div>
          </div>
          <Label className="text-base font-medium">Custom Fields</Label>
          <div className="grid grid-cols-2 gap-4">
            {outputConfig.customFields.map((field, index) => (
              <div
                key={`${field}-${index}`}
                className="flex items-center space-x-2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomField(field)}
                  className="h-4 w-4 p-0 hover:bg-blue-200"
                >
                  ×
                </Button>
                <span className="text-sm">{field}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Fields */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter custom field name..."
              value={newCustomField}
              onChange={(e) => setNewCustomField(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomField()}
            />
            <Button onClick={addCustomField} disabled={!newCustomField.trim()}>
              Add Field
            </Button>
          </div>

          {/*    <div className="space-y-2">
            <Label className="text-sm text-gray-600">Custom Fields:</Label>
            <div className="flex flex-wrap gap-2">
              {outputConfig.customFields.map((field) => (
                <div
                  key={field}
                  className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded"
                >
                  <span className="text-sm">{field}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomField(field)}
                    className="h-4 w-4 p-0 hover:bg-blue-200"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
