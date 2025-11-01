import { api } from '../api';
import type { INotification } from '@/@types/INotification';

export const useListNotification = async (): Promise<INotification[]> => {
  try {
    const { data } = await api.get<INotification[]>('/notifications');

    return data;
  } catch (error) {
    console.error(error);
    return [
      {
        id: '1',
        message: 'Erro ao carregar notificações',
        read: false,
        created_at: new Date().toISOString(),
      },
    ];
  }
};
