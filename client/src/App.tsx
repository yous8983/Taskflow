import './index.css';
import { useEffect, useState } from 'react';
import { useStore } from './store';
import KanbanView from './KanbanView';
import AgendaView from './AgendaView';
import TaskModal from './TaskModal';

function App() {
  const { 
    projects, tasks, activeProjectId, 
    loadData, setActiveProject, addTask, toggleTask, deleteTask, addProject, setEditingTask 
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row h-screen overflow-hidden font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-5 flex flex-col gap-1 shrink-0 md:h-full overflow-y-auto">
        <h1 className="text-2xl font-black text-indigo-600 mb-8 tracking-tight flex items-center gap-2">
          <span>TaskFlow</span> 🚀
        </h1>
        
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4">Menu</div>
        <button 
          onClick={() => setActiveProject(null)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeProjectId === null ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          📥 Backlog
        </button>
        
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">Projets</div>
        {projects.map(p => (
          <button 
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeProjectId === p.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }}></div>
            <span className="truncate">{p.name}</span>
          </button>
        ))}

        <button 
          onClick={() => setIsProjectModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2.5 mt-2 text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> Nouveau Projet
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white md:bg-slate-50">
        <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
          
          {/* Header */}
          <header className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {activeProjectId ? projects.find(p => p.id === activeProjectId)?.name : 'Toutes les tâches'}
            </h2>
            
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setViewMode('list')}>Liste</button>
              <button className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setViewMode('kanban')}>Kanban</button>
              <button className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'agenda' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setViewMode('agenda')}>Agenda</button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {viewMode === 'list' && (
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-3 mb-8 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                  <input 
                    type="text" 
                    placeholder="Ajouter une nouvelle tâche..." 
                    className="flex-1 px-4 py-2 bg-transparent border-none focus:ring-0 outline-none text-slate-700 placeholder-slate-400" 
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                  />
                  <input 
                    type="date" 
                    className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 outline-none focus:border-indigo-500" 
                    value={newTaskDate}
                    onChange={e => setNewTaskDate(e.target.value)}
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
                    Ajouter
                  </button>
                </form>

                <div className="flex flex-col gap-2">
                  {tasks.length === 0 && <p className="text-center text-slate-400 mt-10">Aucune tâche pour le moment.</p>}
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`group bg-white rounded-xl border border-slate-200 p-3 flex items-start gap-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all ${task.status_id === 4 ? 'opacity-60 bg-slate-50' : ''}`}
                      onClick={() => setEditingTask(task)}
                    >
                      <div className="pt-0.5">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                          checked={task.status_id === 4}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleTask(task.id, task.status_id);
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm text-slate-900 truncate ${task.status_id === 4 ? 'line-through text-slate-500' : ''}`}>{task.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          {task.project_id && (
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: projects.find(p => p.id === task.project_id)?.color }}></div>
                              {projects.find(p => p.id === task.project_id)?.name}
                            </span>
                          )}
                          {task.due_date && (
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              📅 {task.due_date}
                            </span>
                          )}
                          {task.priority === 1 && (
                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">Haute</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if(confirm('Supprimer cette tâche ?')) deleteTask(task.id);
                        }} 
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'kanban' && <div className="h-full"><KanbanView /></div>}
            {viewMode === 'agenda' && <div className="max-w-4xl mx-auto"><AgendaView /></div>}
          </div>
        </div>
      </main>

      {/* Modales */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Nouveau Projet</h3>
            </div>
            <form onSubmit={handleAddProject} className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Nom du projet</label>
              <input 
                type="text" 
                placeholder="Ex: Lancement produit" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all mb-6" 
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setIsProjectModalOpen(false)}>Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">Créer le projet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <TaskModal />
    </div>
  );
}

export default App;
