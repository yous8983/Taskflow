import { useEffect, useState } from 'react';
import { useStore } from './store';

function App() {
  const { 
    projects, tasks, activeProjectId, isLoading, 
    loadData, setActiveProject, addTask, toggleTask, deleteTask, addProject 
  } = useStore();
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await addProject(newProjectName, '#8b5cf6'); // Couleur violette par défaut
    setNewProjectName('');
    setIsProjectModalOpen(false);
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
            <span className="truncate">{p.name}</span>
          </button>
        ))}

        {/* Bouton Nouveau Projet */}
        <button 
          onClick={() => setIsProjectModalOpen(true)}
          className="btn btn-outline btn-sm mt-4"
        >
          + Nouveau Projet
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            {activeProjectId ? projects.find(p => p.id === activeProjectId)?.name : 'Toutes les tâches'}
          </h2>

          {/* Formulaire d'ajout de tâche */}
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
                <div key={task.id} className={`card bg-base-100 shadow-sm border border-base-300 ${task.status_id === 4 ? 'opacity-50' : ''}`}>
                  <div className="card-body p-4 flex-row items-center gap-4">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-primary" 
                      checked={task.status_id === 4}
                      onChange={() => toggleTask(task.id, task.status_id)}
                    />
                    <div className="flex-1 cursor-pointer">
                      <p className={`font-semibold ${task.status_id === 4 ? 'line-through' : ''}`}>{task.title}</p>
                      {task.project_id && (
                        <span className="badge badge-ghost badge-sm mt-1">
                          {projects.find(p => p.id === task.project_id)?.name}
                        </span>
                      )}
                    </div>
                    {task.priority === 1 && <div className="badge badge-error badge-sm">Haute</div>}
                    
                    {/* Bouton Supprimer */}
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="btn btn-ghost btn-xs text-error"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Nouveau Projet */}
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
