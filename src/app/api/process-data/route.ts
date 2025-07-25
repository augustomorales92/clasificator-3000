import { auth } from '@/lib/auth'
import axios from 'axios'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files: File[] = []

    // Extract all files from formData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const prompt = formData.get('prompt')

    // Process each file
    const results = await Promise.all(
      files.map(async (file) => {
        const apiFormData = new FormData()
        apiFormData.append('file', file)
        apiFormData.append('user_id', session.user.id)

        if (prompt) {
          apiFormData.append('prompt', prompt.toString())
        }

        const response = await axios.post(
          'https://dispatcher-927995716365.us-central1.run.app/tasks/gemini-ocr',
          apiFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        return {
          fileName: file.name,
          data: response.data,
        }
      })
    )

    return NextResponse.json(
      {
        message: 'Files processed successfully',
        results,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing files:', error)

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'External API error',
          details: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
