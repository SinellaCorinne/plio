import api from '@/lib/axios'
import type { PaginatedResponse, Task, TaskStatus } from '@/types'

export interface TasksParams {
  page?: number
  per_page?: number
  status?: TaskStatus
  due_before?: string
  due_after?: string
}

export interface TaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  due_date?: string | null
}

// GET /api/projects/:projectId/tasks
export async function getTasks(
  projectId: number,
  params: TasksParams = {},
): Promise<PaginatedResponse<Task>> {
  const response = await api.get<PaginatedResponse<Task>>(
    `/projects/${projectId}/tasks`,
    { params },
  )
  return response.data
}

// POST /api/projects/:projectId/tasks
export async function createTask(
  projectId: number,
  data: TaskPayload,
): Promise<Task> {
  const response = await api.post<Task>(`/projects/${projectId}/tasks`, data)
  return response.data
}

// PUT /api/projects/:projectId/tasks/:taskId
export async function updateTask(
  projectId: number,
  taskId: number,
  data: Partial<TaskPayload>,
): Promise<Task> {
  const response = await api.put<Task>(
    `/projects/${projectId}/tasks/${taskId}`,
    data,
  )
  return response.data
}

// DELETE /api/projects/:projectId/tasks/:taskId
export async function deleteTask(
  projectId: number,
  taskId: number,
): Promise<void> {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`)
}
