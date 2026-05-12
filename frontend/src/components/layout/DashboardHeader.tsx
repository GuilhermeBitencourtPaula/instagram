"use client";

import { Bell, Search, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Busca rápida..." 
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all w-48"
          />
        </div>
        
        <button className="relative p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#09090b]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{user?.role || 'PRO'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
