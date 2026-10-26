import { useEffect, useState } from 'react';
import { useStore } from './store';

function App() {
  const { projects, tasks, activeProjectId, isLoading, loadData, setActiveProject, addTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col md:flex-row">
      {/* Sidebar / Menu des projets */}
      <aside className="w-full md:w-64 bg-base-100 shadow-xl p-4 flex flex-col gap-2">
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
            {p.name}
          </button>
        ))}
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            {activeProjectId ? projects.find(p => p.id === activeProjectId)?.name : 'Toutes les tâches'}
          </h2>

          {/* Formulaire d'ajout */}
          <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
            <input 
              type="text" 
              placeholder="Nouvelle tâche..." 
              className="input input-bordered flex-1" 
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </form>

          {/* Liste des tâches */}
          {isLoading ? (
            <div className="text-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <div className="flex flex-col gap-3">
              {tasks.length === 0 && <p className="text-center opacity-50">Aucune tâche pour le moment.</p>}
              {tasks.map(task => (
                <div key={task.id} className="card bg-base-100 shadow-sm border border-base-300">
                  <div className="card-body p-4 flex-row items-center gap-4">
                    <input type="checkbox" className="checkbox checkbox-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">{task.title}</p>
                      {task.project_id && (
                        <span className="badge badge-ghost badge-sm mt-1">
                          {projects.find(p => p.id === task.project_id)?.name}
                        </span>
                      )}
                    </div>
                    {task.priority === 1 && <div className="badge badge-error badge-sm">Haute</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
