import { create } from 'zustand';

export interface Ticket {
  id: number;
  title: string;
  status: string;
  description: string;
  category: string;
  created_at: string;
  scheduling_at: string;
  technician_name: string;
  id_producers: string;
}

interface TicketModalStore {
  isOpen: boolean;
  selectedTicket: Ticket | null;
  openModal: (ticket?: Ticket) => void;
  closeModal: VoidFunction;
}

export const useTicketModalStore = create<TicketModalStore>((set) => ({
  isOpen: false,
  selectedTicket: null,
  openModal: (ticket) => set({ isOpen: true, selectedTicket: ticket }),
  closeModal: () => set({ isOpen: false, selectedTicket: null }),
}));
