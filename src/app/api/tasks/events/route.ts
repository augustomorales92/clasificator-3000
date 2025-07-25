import { db } from '@/lib/db'
import { tasks } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const POLLING_INTERVAL = 1000 // 1 second
const CACHE_DURATION = 100 // 100ms - Reduced from 500ms for more immediate updates

// Cache para evitar consultas repetidas a la base de datos
const tasksCache = new Map<string, { data: any; timestamp: number }>()

async function getTasksFromDB(userId: string) {
  const now = Date.now()
  const cached = tasksCache.get(userId)

  // Si hay datos en caché y son recientes, usarlos
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  // Si no hay caché o está vencido, consultar la base de datos
  const data = await db.query.tasks.findMany({
    where: eq(tasks.userId, userId),
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
  })

  // Actualizar caché
  tasksCache.set(userId, { data, timestamp: now })
  return data
}

export async function GET(request: Request) {
  const { headers } = request
  // Check accept header
  if (headers.get('accept') !== 'text/event-stream') {
    return NextResponse.json(
      { error: 'This endpoint only supports EventSource connections' },
      { status: 400 }
    )
  }

  const { searchParams } = new URL(request.url)
  const userIdParam = searchParams.get('userId')

  if (!userIdParam) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  // Ahora userIdParam es definitivamente string
  const userId: string = userIdParam

  let controller: ReadableStreamDefaultController
  let lastDataStr: string = ''

  const stream = new ReadableStream({
    start(_controller) {
      controller = _controller
      void sendUpdate()
    },
    cancel() {
      // Limpiar la caché cuando se cierra la conexión
      tasksCache.delete(userId)
    },
  })

  async function sendUpdate() {
    try {
      const currentTasks = await getTasksFromDB(userId)
      const currentDataStr = JSON.stringify(currentTasks)

      // Solo enviar datos si han cambiado
      if (currentDataStr !== lastDataStr) {
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode(`data: ${currentDataStr}\n\n`))
        lastDataStr = currentDataStr
      }

      // Programar siguiente actualización
      setTimeout(sendUpdate, POLLING_INTERVAL)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      controller.error(error)
      // Limpiar la caché en caso de error
      tasksCache.delete(userId)
    }
  }

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
