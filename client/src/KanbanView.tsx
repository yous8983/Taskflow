import { useState } from 'react';
import { 
  DndContext, DragOverlay, closestCorners, KeyboardSensor, TouchSensor, MouseSensor, useSensor, useSensors, useDroppable 
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from './store';

function TaskCard({ task }: { task: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const { projects } = useStore();
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={() => !isDragging && useStore.getState().setEditingTask(task)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-3.5 mb-2.5 cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors"
    >
      <div className="flex items-start gap-2">
        <div className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${task.priority === 1 ? 'bg-red-500' : task.priority === 2 ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
        <p className="font-medium text-sm text-slate-800 leading-tight">{task.title}</p>
      </div>
      
      <div className="flex items-center gap-2 mt-3">
        {task.project_id && (
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: projects.find(p => p.id === task.project_id)?.color }}></div>
            {projects.find(p => p.id === task.project_id)?.name}
          </span>
        )}
        {task.due_date && (
          <span className="text-[10px] font-semibold text-slate-500">📅 {task.due_date}</span>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({ status, tasks }: { status: any, tasks: any[] }) {
  const { setNodeRef } = useDroppable({ id: status.id });

  return (
    <div className="bg-slate-100/50 rounded-2xl p-3 min-w-[280px] max-w-[280px] flex flex-col h-full shrink-0 border border-slate-200/60">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }}></div>
          <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide">{status.name}</h3>
        </div>
        <span className="bg-white border border-slate-200 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-md">{tasks.length}</span>
      </div>
      
      <div ref={setNodeRef} className="flex-1 min-h-[150px] overflow-y-auto pr-1">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanView() {
  const { tasks, statuses, updateTaskStatus } = useStore();
  const [activeTask, setActiveTask] = useState<any>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: any) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeTaskId = active.id;
    const overId = over.id;
    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return;

    if (typeof overId === 'number' || !isNaN(Number(overId))) {
      const newStatusId = Number(overId);
      if (task.status_id !== newStatusId) updateTaskStatus(activeTaskId, newStatusId);
      return;
    }

    const overTask = tasks.find(t => t.id === overId);
    if (overTask && task.status_id !== overTask.status_id) {
      updateTaskStatus(activeTaskId, overTask.status_id);
    }
  };

  return (
    <div className="h-full flex gap-5 overflow-x-auto pb-4" style={{ touchAction: 'pan-x' }}>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {statuses.map(status => (
          <KanbanColumn key={status.id} status={status} tasks={tasks.filter(t => t.status_id === status.id)} />
        ))}
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white rounded-xl shadow-xl border-2 border-indigo-500 p-3.5 w-[250px] rotate-2 cursor-grabbing">
              <p className="font-medium text-sm text-slate-800">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
