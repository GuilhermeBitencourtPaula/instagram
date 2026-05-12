"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, PieChart, Loader2, Search, FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";

interface Stats {
  totalSearches: number;
  totalPosts: number;
  totalInsights: number;
  avgEngagement: string;
  topTags: { name: string; count: number }[];
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/searches/stats");
      setStats(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar estatísticas.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Analíticos Avançados
          </h1>
          <p className="text-muted-foreground mt-2">Visão geral de performance e crescimento de nichos coletados.</p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <Loader2 className="w-12 h-12 text-primary animate-spin" />
             <p className="text-muted-foreground mt-4">Calculando métricas de inteligência...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-card/40 border border-white/5 rounded-[2rem] p-6 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total de Buscas</p>
                  <div className="flex items-center justify-between">
                     <p className="text-3xl font-bold text-white">{stats?.totalSearches}</p>
                     <Search className="w-5 h-5 text-primary opacity-50" />
                  </div>
               </div>
               <div className="bg-card/40 border border-white/5 rounded-[2rem] p-6 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Posts Coletados</p>
                  <div className="flex items-center justify-between">
                     <p className="text-3xl font-bold text-white">{stats?.totalPosts}</p>
                     <FileText className="w-5 h-5 text-accent opacity-50" />
                  </div>
               </div>
               <div className="bg-card/40 border border-white/5 rounded-[2rem] p-6 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Insights de IA</p>
                  <div className="flex items-center justify-between">
                     <p className="text-3xl font-bold text-white">{stats?.totalInsights}</p>
                     <Zap className="w-5 h-5 text-yellow-500 opacity-50" />
                  </div>
               </div>
               <div className="bg-card/40 border border-white/5 rounded-[2rem] p-6 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Engajamento Médio</p>
                  <div className="flex items-center justify-between">
                     <p className="text-3xl font-bold text-primary">{stats?.avgEngagement}</p>
                     <TrendingUp className="w-5 h-5 text-primary opacity-50" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-card/40 border border-white/5 rounded-[2rem] p-8 h-[400px] flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-colors" />
                 <div className="text-center space-y-4 relative z-10">
                    <PieChart className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                    <p className="text-muted-foreground font-medium">Gráficos de distribuição de mídia e sentimento estarão disponíveis na próxima atualização.</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card/40 border border-white/5 rounded-[2rem] p-6 h-full">
                  <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Hashtags em Alta
                  </h3>
                  <div className="space-y-4">
                    {stats?.topTags && stats.topTags.length > 0 ? stats.topTags.map((tag, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              #{i + 1}
                           </div>
                           <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">#{tag.name}</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{tag.count} buscas</span>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground text-center py-10">Sem dados de hashtags ainda.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
