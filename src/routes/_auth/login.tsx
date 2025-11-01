import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { FormProvider, useForm } from 'react-hook-form';
import type { IUser } from '@/@types/IUser';

import { Input } from '@/components/shared/Input';
import { Button } from '@/components/ui/button';

import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/auth/login';
import { useUserStore } from '@/stores/user-store';

export const Route = createFileRoute('/_auth/login')({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const form = useForm<IUser>({
    defaultValues: {
      name: '',
    },
  });

  const { handleSubmit } = form;

  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (user) {
      navigate({ to: '/' });
    }
  }, [user, navigate]);

  const { mutateAsync } = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data);
      navigate({ to: '/' });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async ({ name }: IUser) => {
    await mutateAsync(name);
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-8 w-full max-w-md border p-4 rounded-md'
      >
        <FormProvider {...form}>
          <Input name='name' label='Nome' />
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </FormProvider>
      </form>
    </div>
  );
}
