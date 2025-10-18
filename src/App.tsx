import React from 'react'
import TaskList from './components/TaskList'
import { tasks as initialTasks } from './data/mockTasks'

const App: React.FC = () => {
  const [tasks, setTasks] = React.useState(initialTasks)

  // Placeholder for current user; replace with real auth later.
  const currentUser = { id: 'u1', name: 'Akhil', groups: ['group-a'] }

  const handleLock = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId && !t.owner
          ? { ...t, owner: { id: currentUser.id, name: currentUser.name } }
          : t
      )
    )
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Task Dashboard</h1>
        <div className="user">Signed in as {currentUser.name}</div>
      </header>
      <TaskList tasks={tasks} currentUser={currentUser} onLock={handleLock} />
    </div>
  )
}

export default App

