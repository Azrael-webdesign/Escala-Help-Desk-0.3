
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, User, Clock, Bell, Calculator, Settings, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Calendar, label: 'Escala de Trabalho', path: isAdmin ? '/admin-dashboard' : '/employee-dashboard', roles: ['admin', 'employee'] },
    { icon: User, label: 'Colaboradores', path: '/employees', roles: ['admin'] },
    { icon: Clock, label: 'Turnos / Siglas', path: '/shift-codes', roles: ['admin'] },
    { icon: Bell, label: 'Notificações', path: '/notifications', roles: ['admin'] },
    { icon: Calculator, label: 'Calculadora', path: '/calculator', roles: ['admin'] },
    { icon: Settings, label: 'Configurações', path: '/settings', roles: ['admin'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="py-4 flex flex-col space-y-1">
                  <div className="px-4 py-2">
                    <h2 className="text-lg font-semibold">Menu</h2>
                  </div>
                  <div className="px-2 space-y-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="mr-4 h-5 w-5" />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-4 h-5 w-5" />
                      Sair
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold ml-2">Controle de Escalas</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm font-medium">
              {user?.name}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
              <LogOut className="mr-1 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar - desktop only */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200">
          <div className="h-full p-4 flex flex-col">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
