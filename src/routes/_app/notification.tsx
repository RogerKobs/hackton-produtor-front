import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Bell, Check, Trash2 } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { useListNotification } from '@/services/notifications/use-list-notification';

export const Route = createFileRoute('/_app/notification')({
  component: Notification,
});

function Notification() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: useListNotification,
  });

  const unreadCount = notifications?.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {};

  const handleDelete = (id: string) => {
    console.log(id);
  };

  const handleMarkAsRead = (id: string) => {
    console.log(id);
  };

  return (
    <div className='container mx-auto py-6 px-4 max-w-3xl'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Notificações</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            {unreadCount && unreadCount > 0
              ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}`
              : 'Todas as notificações lidas'}
          </p>
        </div>
        {unreadCount && unreadCount > 0 && (
          <Button variant='outline' size='sm' onClick={handleMarkAllAsRead}>
            <Check className='mr-2 h-4 w-4' />
            <span className='hidden sm:inline'>Marcar todas como lidas</span>
            <span className='sm:hidden'>Marcar todas</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>Carregando notificações...</p>
        </div>
      ) : notifications?.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <Bell className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>
              Você não possui notificações
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {notifications?.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? 'opacity-60' : 'border-primary/50'}
            >
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-start gap-3 flex-1'>
                    <div
                      className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                        notification.read ? 'bg-muted' : 'bg-primary'
                      }`}
                    />
                    <div className='flex-1 min-w-0'>
                      <CardDescription className='text-xs mb-1'>
                        {new Date(notification.created_at).toLocaleString(
                          'pt-BR',
                        )}
                      </CardDescription>
                      <p
                        className={`text-sm wrap-break-word ${
                          notification.read
                            ? 'text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-1shrink-0'>
                    {!notification.read && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleMarkAsRead(notification.id)}
                        title='Marcar como lida'
                      >
                        <Check className='h-4 w-4' />
                      </Button>
                    )}
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(notification.id)}
                      title='Excluir'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
