import { Bell, Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

interface AppHeaderProps {
  onMenuClick: VoidFunction;
  onNewTicketClick: VoidFunction;
}

export function AppHeader({ onMenuClick, onNewTicketClick }: AppHeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    setUnreadCount(0);
  };

  return (
    <header className='sticky top-0 z-40 border-b bg-background'>
      <div className='flex h-16 items-center gap-4 px-4'>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden'
          onClick={onMenuClick}
        >
          <Menu className='h-5 w-5' />
        </Button>

        <div className='flex-1' />

        <div className='flex items-center gap-2'>
          <Button size='sm' className='gap-2' onClick={onNewTicketClick}>
            <Plus className='h-4 w-4' />
            <span className='hidden sm:inline'>Novo Chamado</span>
          </Button>

          <Button asChild variant='ghost' size='icon' className='relative'>
            <Link to='/'>
              <Bell className='h-5 w-5' />
              {unreadCount > 0 && (
                <Badge
                  variant='destructive'
                  className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs'
                >
                  {unreadCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
