export type User = {
  id: string
  name: string
  groups?: string[]
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type Task = {
  id: string
  title: string
  status: TaskStatus
  group?: string
  owner?: { id: string; name: string } | null
}

