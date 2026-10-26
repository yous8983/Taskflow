import { useState } from 'react';
import Calendar from 'react-calendar';
import { useStore } from './store';

export default function AgendaView() {
  const { tasks, projects, toggleTask } = useStore();
  const [date, setDate] = useState(new Date());

  // Formater la date sélectionnée en YYYY-MM-DD
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = formatDate(date);
  
  // Filtrer les tâches du jour sélectionné
  const tasksForDay = tasks.filter(t => t.due_date === selectedDateStr);

  // Vérifier si un jour a des tâches (pour afficher un point sur le calendrier)
  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dateStr = formatDate(date);
      const hasTask = tasks.some(t => t.due_date === dateStr);
      if (hasTask) return <div className="task-dot"></div>;
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendrier */}
      <div className="flex-1 bg-base-100 rounded-box p-4 shadow-sm">
        <Calendar 
          onChange={(val) => setDate(val as Date)} 
          value={date} 
          tileContent={tileContent}
        />
      </div>

      {/* Liste des tâches du jour */}
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-4">
          Tâches du {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>
        
        {tasksForDay.length === 0 ? (
          <p className="text-center opacity-50 mt-10">Aucune tâche prévue ce jour-là.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {tasksForDay.map(task => (
              <div key={task.id} className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-4 flex-row items-center gap-4">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary" 
                    checked={task.status_id === 4}
                    onChange={() => toggleTask(task.id, task.status_id)}
                  />
                  <div className="flex-1">
                    <p className={`font-semibold ${task.status_id === 4 ? 'line-through' : ''}`}>{task.title}</p>
                    {task.project_id && (
                      <span className="badge badge-ghost badge-sm mt-1">
                        {projects.find(p => p.id === task.project_id)?.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
