import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  TouchSensor, 
  MouseSensor,
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from './store';

// Composant pour une carte individuelle (Draggable)
function TaskCard({ task }: { task: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none', // Crucial pour mobile
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="card bg-base-100 shadow-sm border border-base-300 p-3 mb-2 cursor-grab active:cursor-grabbing"
    >
      <p className="font-semibold text-sm select-none pointer-events-none">{task.title}</p>
      {task.priority === 1 && <div className="badge badge-error badge-xs mt-2 pointer-events-none">Haute</div>}
    </div>
  );
}

// Composant pour une colonne (Droppable)
function KanbanColumn({ status, tasks }: { status: any, tasks: any[] }) {
  // On rend la colonne elle-même "droppable" pour pouvoir déposer dans une colonne vide
  const { setNodeRef } = useDroppable({
    id: status.id,
  });

  return (
    <div className="bg-base-200 rounded-box p-3 min-w-[280px] flex flex-col h-full shrink-0">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
        <h3 className="font-bold">{status.name}</h3>
        <span className="badge badge-sm">{tasks.length}</span>
      </div>
      
      <div ref={setNodeRef} className="flex-1 min-h-[150px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </SortableContext>
      </div>
    </div>
  );
}

import { useDroppable } from '@dnd-kit/core'; // Import manquant

export default function KanbanView() {
  const { tasks, statuses, updateTaskStatus } = useStore();
  const [activeTask, setActiveTask] = useState<any>(null);

  const sensors = useSensors(
    // Mouse pour PC
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    // Touch pour Mobile avec contrainte
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Un peu plus rapide
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: any) => {
    setActiveTask(null);
    const { active, over } = event;
    
    // Si on a lâché n'importe où (hors d'une zone valide), on ignore
    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return;

    // Si on a lâché directement sur une colonne (zone vide)
    if (typeof overId === 'number' || !isNaN(Number(overId))) {
      const newStatusId = Number(overId);
      if (task.status_id !== newStatusId) {
        updateTaskStatus(activeTaskId, newStatusId);
      }
      return;
    }

    // Si on a lâché sur une autre tâche
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && task.status_id !== overTask.status_id) {
      updateTaskStatus(activeTaskId, overTask.status_id);
    }
  };

  return (
    // Le conteneur principal doit avoir touch-action: pan-x (autorise le scroll horizontal)
    <div className="h-full flex gap-4 overflow-x-auto pb-4" style={{ touchAction: 'pan-x' }}>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {statuses.map(status => (
          <KanbanColumn 
            key={status.id} 
            status={status} 
            tasks={tasks.filter(t => t.status_id === status.id)} 
          />
        ))}
        
        <DragOverlay>
          {activeTask ? (
            <div className="card bg-base-100 shadow-lg border-2 border-primary p-3 w-[250px] rotate-3 cursor-grabbing">
              <p className="font-semibold text-sm">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
