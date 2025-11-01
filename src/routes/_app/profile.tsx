import { useUserStore } from '@/stores/user-store';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCircle, MapPin, Phone, Package } from 'lucide-react';

export const Route = createFileRoute('/_app/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUserStore();

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>Meu Perfil</h1>
      <p className='text-muted-foreground mb-6'>
        Visualize e gerencie suas informações pessoais.
      </p>

      <div className='max-w-4xl'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserCircle className='h-5 w-5' />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-medium text-muted-foreground'>
                    Nome
                  </label>
                  <p className='text-sm font-medium'>{user?.name}</p>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs font-medium text-muted-foreground flex items-center gap-1.5'>
                    <Phone className='h-3 w-3' />
                    Telefone
                  </label>
                  <p className='text-sm'>{user?.cellphone}</p>
                </div>

                <div className='space-y-1 md:col-span-2'>
                  <label className='text-xs font-medium text-muted-foreground flex items-center gap-1.5'>
                    <MapPin className='h-3 w-3' />
                    Endereço
                  </label>
                  <p className='text-sm'>{user?.address}</p>
                </div>

                {user?.production && user.production.length > 0 && (
                  <div className='space-y-1 md:col-span-2'>
                    <label className='text-xs font-medium text-muted-foreground flex items-center gap-1.5'>
                      <Package className='h-3 w-3' />
                      Produção
                    </label>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {user.production.map((production, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-sm'
                        >
                          {production}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
