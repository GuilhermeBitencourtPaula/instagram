"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Search, 
  Zap,
  Plus,
  History,
  Sparkles
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";

const stats = [
  { label: "Pesquisas Realizadas", value: "124", icon: Search, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Perfis Analisados", value: "892", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Insights da IA", value: "3.4k", icon: Sparkles, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "Engajamento Médio", value: "4.8%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Olá, {user?.name?.split(' ')[0] || 'Pesquisador'} <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-muted-foreground">Aqui está o resumo da sua inteligência de mercado hoje.</p>
          </div>
          <button className="bg-white text-black px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-white/90 transition-all shadow-lg shadow-white/5 active:scale-95">
            <Plus className="w-5 h-5" />
            Nova Pesquisa
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/40 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Researches */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Pesquisas Recentes
              </h2>
              <button className="text-sm text-primary hover:underline">Ver todas</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="bg-card/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Nicho: Moda Fitness Verão</h4>
                      <p className="text-xs text-muted-foreground">Processado há 2 horas • 124 posts coletados</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-md">TREND</span>
                    <span className="bg-blue-500/20 text-blue-500 text-[10px] font-bold px-2 py-1 rounded-md">HIGH ENGAGEMENT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              IA Sugestões
            </h2>
            <div className="bg-gradient-to-br from-accent/20 to-primary/10 border border-accent/20 p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700" />
              <p className="text-sm text-white/90 leading-relaxed relative z-10">
                "Detectamos um aumento de <strong>24% no interesse</strong> por conteúdos de 'Sustentabilidade em Cosméticos' nos últimos 3 dias. Sugerimos criar uma pesquisa específica para identificar os principais influenciadores deste sub-nicho."
              </p>
              <button className="mt-6 w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:scale-[1.02] transition-all relative z-10">
                Explorar Tendência
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
