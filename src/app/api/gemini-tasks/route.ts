import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { geminiTasks } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id

    const data = await db.query.geminiTasks.findMany({
      where: eq(geminiTasks.userId, userId),
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Gemini tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Gemini tasks' },
      { status: 500 }
    )
  }
}

/* export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    const userId = searchParams.get('userId') || session.user.id

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    await db
      .delete(geminiTasks)
      .where(and(eq(geminiTasks.id, taskId), eq(geminiTasks.userId, userId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting Gemini task:', error)
    return NextResponse.json(
      { error: 'Failed to delete Gemini task' },
      { status: 500 }
    )
  }
}
 */