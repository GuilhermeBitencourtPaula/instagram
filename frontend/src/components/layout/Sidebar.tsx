"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Search, 
  Camera, 
  BarChart3, 
  Bookmark, 
  Settings, 
  LogOut,
  ShieldAlert,
  Activity
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Search, label: "Pesquisa IA", href: "/search" },
  { icon: Camera, label: "Perfis", href: "/profiles" },
  { icon: BarChart3, label: "Analíticos", href: "/analytics" },
  { icon: Activity, label: "Monitoramento", href: "/monitoring" },
  { icon: Bookmark, label: "Favoritos", href: "/favorites" },
];

const secondaryItems = [
  { icon: Settings, label: "Configurações", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="w-72 h-screen flex flex-col bg-card/30 backdrop-blur-xl border-r border-white/5 p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Camera className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">Viryon</span>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">Menu Principal</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:scale-110 transition-transform")} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            </Link>
          );
        })}

        {user?.role === 'ADMIN' && (
          <Link href="/admin">
            <div className={cn(
              "group flex items-center gap-3 px-3 py-3 mt-4 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all",
              pathname === "/admin" && "bg-orange-500/10 text-orange-500"
            )}>
              <ShieldAlert className="w-5 h-5" />
              <span className="font-medium text-sm">Painel Admin</span>
            </div>
          </Link>
        )}
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-1">
        {secondaryItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all",
              pathname === item.href && "text-white"
            )}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          </Link>
        ))}

        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sair da Conta</span>
        </button>
      </div>

      <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/10">
        <p className="text-xs font-semibold text-primary mb-1">PRO PLAN</p>
        <p className="text-[10px] text-muted-foreground mb-3">Pesquisas ilimitadas ativadas.</p>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="w-[85%] h-full bg-primary" />
        </div>
      </div>
    </aside>
  );
}
