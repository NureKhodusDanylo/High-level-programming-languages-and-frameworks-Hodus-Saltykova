import { useState, useEffect } from 'react';
import { request } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function Analytics() {
  const [stats, setStats] = useState({ completed: 0, pending: 0, total: 0, weeklyData: [] });
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState('');
  const [emailLinks, setEmailLinks] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await request('/analytics');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleTriggerReminders = async () => {
    setTriggering(true);
    setMessage('');
    setEmailLinks([]);
    try {
      const res = await request('/tasks/trigger-reminders', { method: 'POST' });
      setMessage(res.message);
      if (res.emails) {
        setEmailLinks(res.emails);
      }
    } catch (err) {
      setMessage(err.message || 'Error triggering reminders. Are you an admin?');
    } finally {
      setTriggering(false);
    }
  };

  if (loading) return <div className="p-8 text-on-surface-variant text-center">Loading analytics...</div>;

  const chartData = (stats.weeklyData || []).map(d => ({
    name: format(parseISO(d.date), 'MMM dd'),
    completed: d.count
  }));

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' }, 
    { name: 'Pending', value: stats.pending, color: '#f59e0b' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 pb-32 md:pb-12 animate-fade-in">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="font-headline-lg text-4xl font-bold text-primary-container">Task Analytics</h2>
        <div className="flex items-center gap-4">
          {message && <span className={`font-label-md text-sm ${message.includes('Error') ? 'text-error' : 'text-success'}`}>{message}</span>}
          <button 
            onClick={handleTriggerReminders} 
            className="flex items-center gap-2 py-3 px-6 bg-primary-container text-surface font-label-md sketch-border hover:bg-primary-container/90 transition-colors"
            disabled={triggering}
          >
            {triggering ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">mail</span>
            )}
            Trigger Email Reminders
          </button>
        </div>
      </div>

      {emailLinks.length > 0 && (
        <div className="bg-surface-container-low p-6 sketch-border mb-8 border-l-4 border-l-tertiary-container animate-fade-in transform rotate-1">
          <h3 className="font-headline-md text-xl font-bold mb-4 text-primary-container">Sent Notification Emails</h3>
          <ul className="flex flex-col gap-2">
            {emailLinks.map((link, idx) => (
              <li key={idx} className="font-body-md">
                Task: <strong className="text-primary-container">{link.title}</strong> — <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-tertiary-container underline decoration-wavy hover:text-primary-container transition-colors">View Email</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container p-6 sketch-border text-center transform -rotate-1 hover:bg-surface-container-high transition-colors">
          <div className="text-5xl font-black text-primary-container mb-2">{stats.total}</div>
          <div className="font-label-md text-on-surface-variant uppercase tracking-wider">Total Tasks</div>
        </div>
        <div className="bg-surface-container p-6 sketch-border text-center transform rotate-1 hover:bg-surface-container-high transition-colors">
          <div className="text-5xl font-black text-[#10b981] mb-2">{stats.completed}</div>
          <div className="font-label-md text-on-surface-variant uppercase tracking-wider">Completed Tasks</div>
        </div>
        <div className="bg-surface-container p-6 sketch-border text-center transform -rotate-1 hover:bg-surface-container-high transition-colors">
          <div className="text-5xl font-black text-[#f59e0b] mb-2">{stats.pending}</div>
          <div className="font-label-md text-on-surface-variant uppercase tracking-wider">Pending Tasks</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-surface-container p-6 sketch-border transform rotate-1 flex flex-col">
          <h3 className="font-headline-md text-xl font-bold mb-6 text-primary-container flex items-center gap-2">
            <span className="material-symbols-outlined">donut_large</span>
            Status Breakdown
          </h3>
          <div className="h-64 w-full flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70}
                  outerRadius={100} 
                  paddingAngle={5}
                  dataKey="value"
                  stroke="var(--color-primary-container)"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-primary-container)', border: 'none', borderRadius: '4px', color: 'var(--color-surface)' }}
                  itemStyle={{ color: 'var(--color-surface)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-8 bg-surface-container p-6 sketch-border transform -rotate-1 flex flex-col">
          <h3 className="font-headline-md text-xl font-bold mb-6 text-primary-container flex items-center gap-2">
            <span className="material-symbols-outlined">bar_chart</span>
            Completed Tasks (Last 7 Days)
          </h3>
          <div className="flex-grow flex items-center justify-center min-h-[250px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="var(--color-outline-variant)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-outline-variant)" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-primary-container)', border: 'none', borderRadius: '4px', color: 'var(--color-surface)' }}
                    cursor={{ fill: 'var(--color-surface-variant)' }}
                  />
                  <Bar dataKey="completed" fill="var(--color-primary-container)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-on-surface-variant font-body-md text-center">
                No tasks completed in the last 7 days.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
