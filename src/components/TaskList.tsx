import React from 'react'
import type { Task, User } from '../types'

type Props = {
  tasks: Task[]
  currentUser: User
  onLock: (taskId: string) => void
}

const TaskList: React.FC<Props> = ({ tasks, currentUser, onLock }) => {
  const visibleTasks = React.useMemo(() => {
    return tasks.filter(t => {
      const inGroup = t.group ? currentUser.groups?.includes(t.group) : true
      const ownedByUser = t.owner?.id === currentUser.id
      const unassigned = !t.owner
      // Show tasks that are:
      // - unassigned, or
      // - owned by the user, or
      // - in a group the user belongs to
      return unassigned || ownedByUser || inGroup
    })
  }, [tasks, currentUser])

  if (visibleTasks.length === 0) {
    return <main><p>No tasks to show.</p></main>
  }

  return (
    <main>
      <ul className="task-list">
        {visibleTasks.map(t => (
          <li key={t.id} className="task">
            <div className="task-main">
              <div className="task-title">{t.title}</div>
              <div className={`badge status-${t.status}`}>
                {t.status.replace('_', ' ')}
              </div>
            </div>
            <div className="task-meta">
              <span className="owner">{t.owner ? `Owner: ${t.owner.name}` : 'Unassigned'}</span>
              {t.group ? <span className="group">Group: {t.group}</span> : null}
            </div>
            <div className="actions">
              {!t.owner ? (
                <button onClick={() => onLock(t.id)}>Lock</button>
              ) : (
                <button className="secondary">View</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default TaskList

