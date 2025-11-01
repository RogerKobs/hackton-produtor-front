import { useState } from 'react';

import { createFileRoute, Outlet } from '@tanstack/react-router';

import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ModalTicket } from './-components/modal-ticket';
import { useTicketModalStore } from '@/stores/ticket-modal-store';

export const Route = createFileRoute('/_app')({
  component: Layout,
});

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { openModal } = useTicketModalStore();

  return (
    <div className='flex h-screen overflow-hidden'>
      <aside className='hidden lg:flex lg:w-64 lg:flex-col'>
        <AppSidebar />
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side='left' className='p-0 w-64'>
          <AppSidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className='flex flex-1 flex-col overflow-hidden'>
        <AppHeader
          onMenuClick={() => setSidebarOpen(true)}
          onNewTicketClick={() => openModal()}
        />
        <main className='flex-1 overflow-y-auto bg-muted/30'>
          <Outlet />
        </main>
      </div>

      <ModalTicket />
    </div>
  );
}
