import { useEffect, useState } from 'react';
import { useStore } from './store';
import KanbanView from './KanbanView';
import AgendaView from './AgendaView';

function App() {
  const { 
    projects, tasks, activeProjectId, isLoading, 
    loadData, setActiveProject, addTask, toggleTask, deleteTask, addProject 
  } = useStore();
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'agenda'>('list');

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle, newTaskDate);
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await addProject(newProjectName, '#8b5cf6');
    setNewProjectName('');
    setIsProjectModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col md:flex-row h-screen overflow-hidden">
      
      <aside className="w-full md:w-64 bg-base-100 shadow-xl p-4 flex flex-col gap-2 shrink-0 md:h-full overflow-y-auto">
        <h1 className="text-2xl font-bold text-primary mb-4">TaskFlow 🚀</h1>
        <button 
          onClick={() => setActiveProject(null)}
          className={`btn btn-ghost justify-start ${activeProjectId === null ? 'btn-active' : ''}`}
        >
          📥 Backlog (Tout)
        </button>
        
        <div className="divider">Projets</div>
        {projects.map(p => (
          <button 
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            className={`btn btn-ghost justify-start ${activeProjectId === p.id ? 'btn-active' : ''}`}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
            <span className="truncate">{p.name}</span>
          </button>
        ))}

        <button 
          onClick={() => setIsProjectModalOpen(true)}
          className="btn btn-outline btn-sm mt-4"
        >
          + Nouveau Projet
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-8 flex flex-col h-full overflow-hidden">
        <div className="max-w-full mx-auto w-full flex flex-col h-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              {activeProjectId ? projects.find(p => p.id === activeProjectId)?.name : 'Toutes les tâches'}
            </h2>
            
            <div className="join">
              <button 
                className={`btn join-item btn-sm ${viewMode === 'list' ? 'btn-active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 Liste
              </button>
              <button 
                className={`btn join-item btn-sm ${viewMode === 'kanban' ? 'btn-active' : ''}`}
                onClick={() => setViewMode('kanban')}
              >
                🗂️ Kanban
              </button>
              <button 
                className={`btn join-item btn-sm ${viewMode === 'agenda' ? 'btn-active' : ''}`}
                onClick={() => setViewMode('agenda')}
              >
                📅 Agenda
              </button>
            </div>
          </div>

          {viewMode === 'list' && (
            <>
              <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="Nouvelle tâche..." 
                  className="input input-bordered flex-1" 
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                />
                <input 
                  type="date" 
                  className="input input-bordered w-full md:w-auto" 
                  value={newTaskDate}
                  onChange={e => setNewTaskDate(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Ajouter</button>
              </form>

              <div className="flex flex-col gap-3 overflow-y-auto pb-4">
                {tasks.length === 0 && <p className="text-center opacity-50 mt-10">Aucune tâche pour le moment.</p>}
                {tasks.map(task => (
                  <div key={task.id} className={`card bg-base-100 shadow-sm border border-base-300 ${task.status_id === 4 ? 'opacity-50' : ''}`}>
                    <div className="card-body p-4 flex-row items-center gap-4">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-primary" 
                        checked={task.status_id === 4}
                        onChange={() => toggleTask(task.id, task.status_id)}
                      />
                      <div className="flex-1">
                        <p className={`font-semibold ${task.status_id === 4 ? 'line-through' : ''}`}>{task.title}</p>
                        <div className="flex gap-2 mt-1">
                          {task.project_id && (
                            <span className="badge badge-ghost badge-sm">
                              {projects.find(p => p.id === task.project_id)?.name}
                            </span>
                          )}
                          {task.due_date && (
                            <span className="badge badge-outline badge-sm">📅 {task.due_date}</span>
                          )}
                        </div>
                      </div>
                      {task.priority === 1 && <div className="badge badge-error badge-sm">Haute</div>}
                      <button onClick={() => deleteTask(task.id)} className="btn btn-ghost btn-xs text-error">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {viewMode === 'kanban' && (
            <div className="flex-1 overflow-hidden">
              <KanbanView />
            </div>
          )}

          {viewMode === 'agenda' && (
            <div className="flex-1 overflow-y-auto">
              <AgendaView />
            </div>
          )}

        </div>
      </main>

      {isProjectModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Créer un nouveau projet</h3>
            <form onSubmit={handleAddProject}>
              <input 
                type="text" 
                placeholder="Nom du projet" 
                className="input input-bordered w-full mb-4" 
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                autoFocus
              />
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsProjectModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
