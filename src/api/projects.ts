import api from '@/lib/axios'
import type { PaginatedResponse, Project } from '@/types'

export interface ProjectsParams {
  page?: number
  per_page?: number
}

export interface ProjectPayload {
  title: string
  description?: string
}

// GET /api/projects
export async function getProjects(
  params: ProjectsParams = {},
): Promise<PaginatedResponse<Project>> {
  const response = await api.get<PaginatedResponse<Project>>('/projects', { params })
  return response.data
}

// GET /api/projects/:id
export async function getProject(id: number): Promise<Project> {
  const response = await api.get<Project>(`/projects/${id}`)
  return response.data
}

// POST /api/projects
export async function createProject(data: ProjectPayload): Promise<Project> {
  const response = await api.post<Project>('/projects', data)
  return response.data
}

// PUT /api/projects/:id
export async function updateProject(
  id: number,
  data: Partial<ProjectPayload>,
): Promise<Project> {
  const response = await api.put<Project>(`/projects/${id}`, data)
  return response.data
}

// DELETE /api/projects/:id
export async function deleteProject(id: number): Promise<void> {
  await api.delete(`/projects/${id}`)
}
