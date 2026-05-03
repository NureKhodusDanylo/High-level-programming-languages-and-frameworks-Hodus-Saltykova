import { useState } from 'react';
import { request } from '../api';
import { Link } from 'react-router-dom';

export default function TaskCard({ task, onDelete, onEdit, onStatusToggle }) {
  const isCompleted = task.status === 'completed';
  const [reminding, setReminding] = useState(false);

  const now = new Date();
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const isUrgent = !isCompleted && deadlineDate && (deadlineDate.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) && (deadlineDate.getTime() > now.getTime());
  const isOverdue = !isCompleted && deadlineDate && (deadlineDate.getTime() <= now.getTime());

  const handleRemind = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setReminding(true);
    try {
      const res = await request(`/tasks/${task.id}/remind`, { method: 'POST' });
      if (Notification.permission === 'granted') {
        new Notification('Task Reminder', { body: `Нагадування відправлено для: ${task.title}` });
      }
      if (res.url) {
        window.open(res.url, '_blank');
      } else {
        alert('Нагадування успішно відправлено на вашу реальну пошту!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReminding(false);
    }
  };

  let deadlineLabel = '';
  let deadlineColor = 'text-on-surface-variant';
  if (isCompleted) {
    deadlineLabel = 'Completed';
  } else if (isOverdue) {
    deadlineLabel = 'Overdue';
    deadlineColor = 'text-error';
  } else if (isUrgent) {
    deadlineLabel = 'Due Soon';
    deadlineColor = 'text-tertiary-container';
  } else if (task.deadline) {
    deadlineLabel = new Date(task.deadline).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <>
      <div className="flex items-start gap-3 group relative">
        <label className="relative flex items-center justify-center mt-1 cursor-pointer">
          <input 
            type="checkbox" 
            className="peer sr-only" 
            checked={isCompleted}
            onChange={onStatusToggle}
          />
          <div className="w-5 h-5 sketch-border-thin bg-surface peer-checked:bg-primary-container transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-surface text-[16px] opacity-0 peer-checked:opacity-100 transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>
              close
            </span>
          </div>
        </label>
        
        <div className="flex-1 flex flex-col">
          <span className={`font-body-md text-base ${isCompleted ? 'line-through text-on-surface-variant' : 'text-primary-container group-hover:underline cursor-pointer'}`}>
            {task.title}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <p className={`font-label-md text-xs ${deadlineColor}`}>
              {deadlineLabel}
            </p>
            {task.userEmail && (
              <span className="font-label-md text-[10px] bg-primary-container/10 px-1 rounded text-primary-container">
                {task.userEmail.split('@')[0]}
              </span>
            )}
          </div>
          <p className="font-body-md text-xs text-on-surface-variant mt-2 line-clamp-2">
            {task.description}
          </p>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-surface pl-2">
          <button 
            onClick={(e) => { e.preventDefault(); onEdit(); }} 
            className="w-8 h-8 flex items-center justify-center sketch-border-thin hover:bg-surface-variant transition-colors text-primary-container" 
            title="Edit"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button 
            onClick={handleRemind} 
            className="w-8 h-8 flex items-center justify-center sketch-border-thin hover:bg-surface-variant transition-colors text-primary-container" 
            title="Remind"
            disabled={reminding}
          >
            {reminding ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            )}
          </button>
          <Link 
            to={`/tasks/${task.id}`} 
            className="w-8 h-8 flex items-center justify-center sketch-border-thin hover:bg-surface-variant transition-colors text-primary-container" 
            title="Details"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </Link>
          <button 
            onClick={(e) => { e.preventDefault(); onDelete(); }} 
            className="w-8 h-8 flex items-center justify-center sketch-border-thin hover:bg-error-container hover:text-error transition-colors text-primary-container" 
            title="Delete"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
      <div className="sketch-divider opacity-50"></div>
    </>
  );
}
