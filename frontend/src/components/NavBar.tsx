import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, List } from 'lucide-react';

const NavBar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">EmpresaSys</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              Empresas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;