import type { Task } from '../types'

export const tasks: Task[] = [
  { id: 't1', title: 'Intake form review', status: 'todo', group: 'group-a', owner: null },
  { id: 't2', title: 'Vitals cross-check', status: 'in_progress', group: 'group-b', owner: { id: 'u2', name: 'Sam' } },
  { id: 't3', title: 'Notify patient about schedule', status: 'done', group: 'group-a', owner: { id: 'u1', name: 'Akhil' } },
  { id: 't4', title: 'Insurance verification', status: 'todo', group: 'group-a', owner: null },
  { id: 't5', title: 'Lab results triage', status: 'in_progress', group: 'group-c', owner: null },
]

