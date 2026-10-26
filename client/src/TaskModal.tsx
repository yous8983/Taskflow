import { useState, useEffect } from 'react';
import { useStore } from './store';

export default function TaskModal() {
  const { editingTask, setEditingTask, saveTask, deleteTask, projects, statuses } = useStore();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        due_date: editingTask.due_date || '',
        priority: editingTask.priority || 2,
        status_id: editingTask.status_id || 1,
        project_id: editingTask.project_id || ''
      });
    }
  }, [editingTask]);

  if (!editingTask) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      due_date: formData.due_date === '' ? null : formData.due_date,
      project_id: formData.project_id === '' ? null : Number(formData.project_id),
    };
    saveTask(editingTask.id, dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-900">Détails de la tâche</h3>
          <button onClick={() => setEditingTask(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="task-form" onSubmit={handleSave} className="flex flex-col gap-5">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Titre de la tâche</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 h-32 resize-none" 
                placeholder="Ajouter plus de détails..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date d'échéance</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700" 
                  value={formData.due_date}
                  onChange={e => setFormData({...formData, due_date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Projet</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700" 
                  value={formData.project_id}
                  onChange={e => setFormData({...formData, project_id: e.target.value})}
                >
                  <option value="">Aucun projet</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Statut</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700" 
                  value={formData.status_id}
                  onChange={e => setFormData({...formData, status_id: Number(e.target.value)})}
                >
                  {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Priorité</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700" 
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: Number(e.target.value)})}
                >
                  <option value={1}>🔴 Haute</option>
                  <option value={2}>🟡 Normale</option>
                  <option value={3}>🟢 Basse</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button 
            type="button" 
            onClick={() => {
              if(confirm('Supprimer définitivement cette tâche ?')) deleteTask(editingTask.id);
            }} 
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            Supprimer
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={() => setEditingTask(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Annuler</button>
            <button type="submit" form="task-form" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">Sauvegarder</button>
          </div>
        </div>
      </div>
    </div>
  );
}
