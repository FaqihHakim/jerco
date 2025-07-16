
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { LOGO_TEXT } from '../constants';

const InitialChoicePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
        className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4"
        style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-xl shadow-2xl text-center max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-black mb-4">{LOGO_TEXT}</h1>
        <p className="text-neutral-700 text-lg mb-10">Welcome to the official store for football enthusiasts.</p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/login')}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Login as User
          </Button>
          <Button 
            onClick={() => navigate('/admin/login')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Login as Admin
          </Button>
        </div>
        <p className="mt-8 text-sm text-gray-600">
          New user? <button onClick={() => navigate('/register')} className="font-semibold text-black hover:underline">Create an account</button>
        </p>
      </div>
    </div>
  );
};

export default InitialChoicePage;
