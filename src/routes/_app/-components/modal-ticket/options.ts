export const CATEGORY_OPTIONS = [
  { label: 'Assistência Técnica', value: 'technical' },
  { label: 'Consultoria Financeira', value: 'financial' },
  { label: 'Acessoria Jurídica', value: 'legal' },
  { label: 'Capacitação', value: 'training' },
  { label: 'Outros', value: 'other' },
];

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  scheduled: 'Agendado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export const STATUS_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  scheduled: 'default',
  in_progress: 'default',
  completed: 'outline',
  cancelled: 'destructive',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#eb7b24', text: '#ffffff' },
  scheduled: { bg: '#008f35', text: '#ffffff' },
  in_progress: { bg: '#eb7b24', text: '#ffffff' },
  completed: { bg: '#008f35', text: '#ffffff' },
  cancelled: { bg: '#000000', text: '#ffffff' },
};
