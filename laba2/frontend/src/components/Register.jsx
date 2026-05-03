import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-12 px-4">
      <div className="w-full max-w-md bg-surface-container p-8 md:p-10 sketch-border transform -rotate-1 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 sketch-border-thin flex items-center justify-center bg-tertiary-container text-on-tertiary-container transform rotate-3">
            <span className="material-symbols-outlined text-4xl">person_add</span>
          </div>
        </div>
        <h2 className="font-headline-lg text-3xl font-bold text-center text-primary-container mb-8">Create Account</h2>
        
        {error && (
          <div className="bg-error-container text-on-error-container p-3 mb-6 sketch-border-thin text-sm font-label-md transform rotate-1">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block font-label-md text-sm text-primary-container mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-surface px-4 py-3 sketch-border-thin focus:outline-none focus:ring-2 focus:ring-tertiary-container/50 font-body-md transition-shadow" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block font-label-md text-sm text-primary-container mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-surface px-4 py-3 sketch-border-thin focus:outline-none focus:ring-2 focus:ring-tertiary-container/50 font-body-md transition-shadow" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-tertiary-container text-on-tertiary-container font-label-md py-4 sketch-border mt-2 hover:bg-tertiary-container/90 transition-colors transform hover:-translate-y-1">
            Register
          </button>
        </form>
        
        <p className="mt-8 text-center font-body-md text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-tertiary-container font-bold underline decoration-wavy hover:text-primary-container transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
