import { create } from 'zustand';

export interface Ticket {
  id: number;
  category: string;
  created_at: string;
  status: string;
  description: string;
  scheduled_time: string;
  technician_name: string;
}

interface TicketModalStore {
  isOpen: boolean;
  selectedTicket: Ticket | null;
  openModal: (ticket?: Ticket) => void;
  closeModal: () => void;
}

export const useTicketModalStore = create<TicketModalStore>((set) => ({
  isOpen: false,
  selectedTicket: null,
  openModal: (ticket) => set({ isOpen: true, selectedTicket: ticket }),
  closeModal: () => set({ isOpen: false, selectedTicket: null }),
}));
