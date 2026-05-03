import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import TaskDetails from './components/TaskDetails';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-surface p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-screen w-64 border-r-2 border-primary-container/30 bg-[#FCFAF7] py-6 px-4 z-20 shrink-0 sticky top-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="flex flex-col items-center gap-2 py-4 mb-4 border-b-2 border-primary-container/10 w-full">
            <div className="relative">
              <div className="w-20 h-20 bg-primary-fixed-dim sketch-border rotate-3 flex items-center justify-center text-primary-container font-headline-lg overflow-hidden">
                <span className="material-symbols-outlined text-4xl">person</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-tertiary-fixed-dim text-[10px] font-bold px-1 sketch-border transform -rotate-12">
                {user.role === 'admin' ? 'ADMIN' : 'PRO'}
              </div>
            </div>
            <div className="text-center mt-2">
              <h2 className="text-xl font-black text-primary-container leading-tight">{user.email.split('@')[0]}</h2>
              <p className="text-xs font-medium text-primary-container/60 italic uppercase tracking-wider">Student Portfolio</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-6 px-2">
          <h1 className="text-lg font-bold tracking-tight text-primary-container underline decoration-wavy decoration-1 leading-none">HNURE Startup</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-3 py-2 transition-all duration-300 rounded group ${
              isActive('/') 
                ? 'text-primary-container font-black underline decoration-wavy decoration-primary-container rotate-1 scale-95 bg-primary-container/5 sketch-border-thin' 
                : 'text-primary-container/70 hover:text-primary-container hover:bg-primary-container/5'
            }`}
          >
            <span className={`material-symbols-outlined transition-transform ${isActive('/') ? '' : 'group-hover:rotate-12'}`}>dashboard</span>
            <span className="font-label-md font-bold">Dashboard</span>
          </Link>
          
          <Link 
            to="/analytics" 
            className={`flex items-center gap-3 px-3 py-2 transition-all duration-300 rounded group ${
              isActive('/analytics') 
                ? 'text-primary-container font-black underline decoration-wavy decoration-primary-container rotate-1 scale-95 bg-primary-container/5 sketch-border-thin' 
                : 'text-primary-container/70 hover:text-primary-container hover:bg-primary-container/5'
            }`}
          >
            <span className={`material-symbols-outlined transition-transform ${isActive('/analytics') ? '' : 'group-hover:rotate-12'}`}>monitoring</span>
            <span className="font-label-md font-bold">Analytics</span>
          </Link>

          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-primary-container/70 hover:text-error hover:bg-error/5 transition-all duration-300 rounded group text-left mt-auto"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">logout</span>
            <span className="font-label-md">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden animate-fade-in">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden bg-[#FCFAF7] text-primary-container font-body-md text-[11px] font-bold uppercase tracking-wider fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 border-t-2 border-primary-container rounded-t-lg shadow-[0_-4px_0_0_rgba(47,49,50,0.1)]">
        <Link to="/" className={`flex flex-col items-center justify-center transition-transform relative ${isActive('/') ? 'bg-primary-container/10 rounded-lg border border-primary-container px-3 py-1 scale-105' : 'opacity-70'}`}>
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: isActive('/') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/analytics" className={`flex flex-col items-center justify-center transition-transform relative ${isActive('/analytics') ? 'bg-primary-container/10 rounded-lg border border-primary-container px-3 py-1 scale-105' : 'opacity-70'}`}>
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: isActive('/analytics') ? "'FILL' 1" : "'FILL' 0" }}>monitoring</span>
          <span>Analytics</span>
        </Link>
        <button onClick={logout} className="flex flex-col items-center justify-center opacity-70 hover:rotate-1 transition-transform">
          <span className="material-symbols-outlined mb-1">logout</span>
          <span>Logout</span>
        </button>
      </nav>

      {/* Footer (Sticky Note) */}
      <footer className="bg-[#FEF9C3] text-primary-container font-body-md italic text-sm fixed bottom-20 right-4 w-64 p-4 rotate-[-2deg] border-2 border-primary-container shadow-[4px_4px_0_0_#2F3132] max-w-xs z-40 hover:rotate-0 transition-transform duration-300 group hidden xl:block">
        <div className="absolute -top-2 -left-2 w-8 h-3 bg-primary-container/20 transform rotate-45"></div>
        <div className="absolute -top-2 -right-2 w-8 h-3 bg-primary-container/20 transform -rotate-45"></div>
        <p className="mb-3 relative z-10 group-hover:-translate-y-0.5 transition-transform">Mentor Feedback: Keep pushing your project! The UI is looking sketching awesome.</p>
        <div className="flex gap-3 text-xs">
          <button className="font-bold underline hover:opacity-80">Got it!</button>
        </div>
      </footer>
    </>
  );
}

export default App;
