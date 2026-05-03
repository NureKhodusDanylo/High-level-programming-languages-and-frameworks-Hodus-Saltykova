import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { request } from '../api';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await request(`/tasks/${id}`);
        setTask(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <div className="p-8 text-center font-body-md text-on-surface-variant animate-pulse">Loading task details...</div>;
  if (!task) return <div className="p-8 text-center font-body-md text-error">Task not found</div>;

  const isCompleted = task.status === 'completed';

  const handleDelete = async () => {
    try {
      await request(`/tasks/${id}`, { method: 'DELETE' });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const newStatus = isCompleted ? 'pending' : 'completed';
      await request(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...task, status: newStatus })
      });
      setTask({ ...task, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 pb-32 md:pb-12 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary-container font-label-md mb-8 transition-colors group">
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Back to Dashboard
      </Link>
      
      <div className="bg-surface-container p-8 md:p-10 sketch-border transform -rotate-1 relative">
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-8xl transform rotate-12">receipt_long</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 relative z-10">
          <h2 className={`font-headline-lg text-3xl font-bold ${isCompleted ? 'line-through text-on-surface-variant' : 'text-primary-container'}`}>
            {task.title}
          </h2>
          <span className={`font-label-md px-3 py-1 sketch-border-thin transform rotate-2 ${isCompleted ? 'bg-surface-variant text-on-surface-variant' : 'bg-tertiary-container text-on-tertiary-container'}`}>
            {task.status.toUpperCase()}
          </span>
        </div>

        <div className="bg-surface p-6 sketch-border-thin mb-8 relative z-10 transform rotate-1 shadow-sm">
          <h3 className="font-label-md text-sm text-on-surface-variant mb-2 uppercase tracking-wider">Description</h3>
          <p className="font-body-lg text-on-surface whitespace-pre-wrap min-h-[100px]">
            {task.description || <span className="italic text-on-surface-variant/50">No description provided.</span>}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 relative z-10">
          <div className="bg-surface-container-low p-4 sketch-border flex items-start gap-3">
            <span className="material-symbols-outlined text-tertiary-container">event</span>
            <div>
              <strong className="block font-label-md text-sm text-on-surface-variant mb-1">Deadline</strong>
              <span className="font-body-md text-primary-container">
                {task.deadline ? new Date(task.deadline).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No deadline set'}
              </span>
            </div>
          </div>
          <div className="bg-surface-container-low p-4 sketch-border flex items-start gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
            <div>
              <strong className="block font-label-md text-sm text-on-surface-variant mb-1">Created At</strong>
              <span className="font-body-md text-primary-container">
                {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
          {task.userEmail && (
            <div className="sm:col-span-2 bg-surface-container-low p-4 sketch-border flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary-fixed-dim">person</span>
              <div>
                <strong className="block font-label-md text-sm text-on-surface-variant mb-1">Owner</strong>
                <span className="font-body-md text-primary-container font-bold underline decoration-wavy decoration-secondary-fixed-dim underline-offset-4">
                  {task.userEmail}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-outline-variant border-dashed relative z-10">
          <button 
            onClick={handleStatusToggle}
            className={`flex-1 flex items-center justify-center gap-2 font-label-md py-3 sketch-border transition-colors transform hover:-translate-y-1 ${isCompleted ? 'bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80' : 'bg-primary-container text-surface hover:bg-primary-container/90'}`}
          >
            <span className="material-symbols-outlined text-[20px]">{isCompleted ? 'undo' : 'task_alt'}</span>
            {isCompleted ? 'Mark Pending' : 'Mark Completed'}
          </button>
          <button 
            onClick={handleDelete} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-error-container text-on-error-container font-label-md py-3 px-6 sketch-border hover:bg-error-container/90 transition-colors transform hover:rotate-2"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
