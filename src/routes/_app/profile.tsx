import { useUserStore } from '@/stores/user-store'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_app/profile')({
  component: RouteComponent,
})

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Profile {
  name: string
  address: string
  production: string
  categories: string[]
}

function RouteComponent() {
  const {user} = useUserStore();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-gray-100">
      <div className="max-w-4xl mx-auto mt-12 bg-zinc-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-green-500 mb-6 text-center">
          Meu Perfil
        </h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-gray-400 text-sm uppercase">Nome</h2>
            <p className="text-lg font-semibold">{user?.name}</p>
          </div>

          <div>
            <h2 className="text-gray-400 text-sm uppercase">Endereço</h2>
            <p className="text-lg">{user?.address}</p>
          </div>

          <div>
            <h2 className="text-gray-400 text-sm uppercase">Telefone</h2>
            <p className="text-lg">{user?.cellphone}</p>
          </div>

          <div>
            <h2 className="text-gray-400 text-sm uppercase">Produção</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.production.map((cat, index) => (
                <span
                  key={index}
                  className="bg-green-600/20 border border-green-500/40 text-green-400 px-3 py-1 rounded-full text-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}