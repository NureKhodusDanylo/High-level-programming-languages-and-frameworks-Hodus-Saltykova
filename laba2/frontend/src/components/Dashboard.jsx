import { useState, useEffect } from 'react';
import { request } from '../api';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const fetchTasks = async () => {
    try {
      const data = await request('/tasks');
      setTasks(data);

      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const upcomingTasks = data.filter(t => t.status !== 'completed' && t.deadline && new Date(t.deadline) <= tomorrow);
      
      if (upcomingTasks.length > 0) {
        const msg = `Attention! You have ${upcomingTasks.length} ${upcomingTasks.length === 1 ? 'task' : 'tasks'} due soon or overdue!`;
        setNotification(msg);
      } else {
        setNotification(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await request(`/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await request(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...task, status: newStatus })
      });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 pb-32 md:pb-12">
      {notification && (
        <div className="bg-error-container text-on-error-container p-4 sketch-border mb-8 animate-fade-in flex justify-between items-center transform rotate-1">
          <span className="font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">notifications_active</span>
            {notification}
          </span>
          <button onClick={() => setNotification(null)} className="hover:opacity-70">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <TaskForm 
            task={editingTask} 
            onSuccess={() => {
              setShowForm(false);
              setEditingTask(null);
              fetchTasks();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        </div>
      )}

      <div className="flex flex-col gap-8">
        {/* Welcome / Profile Summary */}
        <section className="bg-surface-container p-6 md:p-8 sketch-border sketch-shadow relative transform -rotate-1">
          <div className="absolute top-2 right-4 text-outline-variant opacity-30">
            <span className="material-symbols-outlined text-4xl transform rotate-12">draw</span>
          </div>
          <h1 className="font-headline-lg text-4xl font-bold mb-2 text-primary-container">
            Hello, {user?.email.split('@')[0]}
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant">Let's knock out some tasks today.</p>
        </section>

        {/* Tasks */}
        <section className="bg-surface-container-lowest p-6 sketch-border flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-xl font-bold flex items-center gap-2 text-primary-container">
              <span className="material-symbols-outlined">checklist</span>
              {user?.role === 'admin' ? 'All System Tasks' : 'My Tasks'}
            </h2>
            <button 
              onClick={() => { setEditingTask(null); setShowForm(!showForm); }}
              className="w-10 h-10 flex items-center justify-center sketch-border-thin hover:bg-surface-variant transition-colors rounded-full"
            >
              <span className="material-symbols-outlined text-primary-container">add</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="text-center text-on-surface-variant">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center text-on-surface-variant py-8">No tasks found. Click the + button to create one.</div>
            ) : (
              tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDelete={() => handleDelete(task.id)}
                  onEdit={() => handleEdit(task)}
                  onStatusToggle={() => handleStatusToggle(task)}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
