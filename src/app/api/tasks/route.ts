import { db } from '@/lib/db'
import { tasks } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const data = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('taskId')
  const userId = searchParams.get('userId')

  if (!taskId || !userId) {
    return NextResponse.json(
      { error: 'Task ID and User ID are required' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    await db
      .update(tasks)
      .set(body)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('taskId')
  const userId = searchParams.get('userId')

  if (!taskId || !userId) {
    return NextResponse.json(
      { error: 'Task ID and User ID are required' },
      { status: 400 }
    )
  }

  try {
    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
