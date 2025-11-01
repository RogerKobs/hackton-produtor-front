import { Bell, Home, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useUserStore } from '@/stores/user-store';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/notification', label: 'Notificações', icon: Bell },
  { href: '/profile', label: 'Meu Perfil', icon: User },
];

interface AppSidebarProps {
  onClose?: VoidFunction;
}

export function AppSidebar({ onClose }: AppSidebarProps) {
  const pathname = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className='flex h-full flex-col bg-background border-r'>
      <div className='border-b p-6'>
        <Link
          to='/'
          className='font-bold text-xl text-primary'
          onClick={onClose}
        >
          <img
            src='/logo.png'
            alt='Logo'
            width='100%'
            className='h-15'
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>

      <nav className='flex-1 space-y-1 p-4'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname.pathname === item.href ||
            pathname.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className='h-5 w-5' />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className='border-t p-4'>
        <Button
          variant='ghost'
          className='w-full justify-start text-muted-foreground hover:text-foreground'
          onClick={handleLogout}
        >
          <LogOut className='mr-3 h-5 w-5' />
          Sair
        </Button>
      </div>
    </div>
  );
}
