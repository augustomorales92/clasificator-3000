import { db } from '@/lib/db'
import { tasks } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  let controller: ReadableStreamDefaultController

  const stream = new ReadableStream({
    start(_controller) {
      controller = _controller
      void sendUpdate()
    },
    cancel() {
      // Cleanup if needed
    },
  })

  async function sendUpdate() {
    try {
      // Ensure userId is not null before querying
      const currentTasks = await db.query.tasks.findMany({
        where: eq(tasks.userId, userId as string),
        orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
      })

      const encoder = new TextEncoder()
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(currentTasks)}\n\n`)
      )

      // Schedule next update in 1 second
      setTimeout(sendUpdate, 1000)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      controller.error(error)
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
