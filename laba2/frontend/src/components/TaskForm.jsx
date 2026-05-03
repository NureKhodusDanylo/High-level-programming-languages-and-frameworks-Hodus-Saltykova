import { useState, useEffect } from 'react';
import { request } from '../api';

export default function TaskForm({ task, onSuccess, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      if (task.deadline) {
        const localDate = new Date(task.deadline);
        const offset = localDate.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(localDate - offset)).toISOString().slice(0, 16);
        setDeadline(localISOTime);
      } else {
        setDeadline('');
      }
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let finalDeadline = deadline;
      if (deadline) {
        finalDeadline = new Date(deadline).toISOString();
      }

      if (task) {
        await request(`/tasks/${task.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, description, deadline: finalDeadline })
        });
      } else {
        await request('/tasks', {
          method: 'POST',
          body: JSON.stringify({ title, description, deadline: finalDeadline })
        });
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-low p-6 sketch-border animate-fade-in relative z-10 transform -rotate-1">
      <div className="absolute top-2 right-4 text-outline-variant opacity-30">
        <span className="material-symbols-outlined text-3xl transform rotate-12">edit_note</span>
      </div>
      <h3 className="font-headline-md text-2xl font-bold mb-6 text-primary-container">
        {task ? 'Edit Task' : 'Create New Task'}
      </h3>
      
      {error && (
        <div className="bg-error-container text-on-error-container p-3 mb-6 sketch-border-thin text-sm font-label-md transform rotate-1">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block font-label-md text-sm text-primary-container mb-2">Title *</label>
          <input 
            type="text" 
            className="w-full bg-surface px-4 py-3 sketch-border-thin focus:outline-none focus:ring-2 focus:ring-primary-container/50 font-body-md transition-shadow" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
            placeholder="What needs to be done?"
          />
        </div>
        
        <div>
          <label className="block font-label-md text-sm text-primary-container mb-2">Description</label>
          <textarea 
            className="w-full bg-surface px-4 py-3 sketch-border-thin focus:outline-none focus:ring-2 focus:ring-primary-container/50 font-body-md transition-shadow resize-y min-h-[100px]" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Add details..."
          />
        </div>
        
        <div>
          <label className="block font-label-md text-sm text-primary-container mb-2">Deadline</label>
          <input 
            type="datetime-local" 
            className="w-full bg-surface px-4 py-3 sketch-border-thin focus:outline-none focus:ring-2 focus:ring-primary-container/50 font-body-md transition-shadow" 
            value={deadline} 
            onChange={e => setDeadline(e.target.value)} 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button 
            type="submit" 
            className="flex-1 bg-primary-container text-surface font-label-md py-3 sketch-border hover:bg-primary-container/90 transition-colors" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Task'}
          </button>
          <button 
            type="button" 
            className="flex-1 bg-surface-variant text-on-surface-variant font-label-md py-3 sketch-border hover:bg-surface-variant/80 transition-colors" 
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
