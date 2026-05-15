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
  followersCount: number;
  mediaDistribution: { type: string; percentage: string }[];
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Seguidores Reais</p>
                  <div className="flex items-center justify-between">
                     <p className="text-3xl font-bold text-white">
                       {stats?.followersCount ? (stats.followersCount > 999 ? (stats.followersCount/1000).toFixed(1) + 'k' : stats.followersCount) : '0'}
                     </p>
                     <Users className="w-5 h-5 text-blue-500 opacity-50" />
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
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Engajamento</p>
                  <div className="flex items-center justify-between">
                     <p className="text-3xl font-bold text-primary">{stats?.avgEngagement}</p>
                     <TrendingUp className="w-5 h-5 text-primary opacity-50" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-card/40 border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                 <div className="flex items-center justify-between mb-10 relative z-10">
                    <h3 className="font-bold text-xl text-white flex items-center gap-3">
                       <PieChart className="w-6 h-6 text-primary" />
                       Distribuição de Mídia no Nicho
                    </h3>
                    <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase tracking-tighter">
                       Dados em Tempo Real
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                    {(stats?.mediaDistribution || []).map((item, i) => {
                      const labelMap: Record<string, { label: string, color: string, icon: any, shadow: string }> = {
                        'CAROUSEL_ALBUM': { 
                          label: 'Carrossel', 
                          color: 'from-indigo-500 to-purple-600', 
                          icon: LayoutDashboard,
                          shadow: 'shadow-indigo-500/20'
                        },
                        'IMAGE': { 
                          label: 'Fotos', 
                          color: 'from-blue-400 to-cyan-500', 
                          icon: Camera,
                          shadow: 'shadow-blue-500/20'
                        },
                        'VIDEO': { 
                          label: 'Vídeos', 
                          color: 'from-rose-500 to-pink-600', 
                          icon: Zap,
                          shadow: 'shadow-rose-500/20'
                        }
                      };
                      
                      const info = labelMap[item.type] || { 
                        label: item.type, 
                        color: 'from-primary to-secondary', 
                        icon: FileText,
                        shadow: 'shadow-primary/20'
                      };
                      const Icon = info.icon;

                      return (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="group p-8 bg-white/[0.03] backdrop-blur-md rounded-[3rem] border border-white/5 text-center space-y-6 hover:border-white/10 transition-all cursor-default"
                        >
                           <div className={cn("w-16 h-16 rounded-[1.5rem] mx-auto flex items-center justify-center bg-gradient-to-br shadow-2xl transition-transform group-hover:rotate-12", info.color, info.shadow)}>
                              <Icon className="w-8 h-8 text-white" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">{info.label}</p>
                              <div className="text-5xl font-black text-white tracking-tighter tabular-nums">{item.percentage}</div>
                           </div>
                           <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                              <div className={cn("h-full rounded-full bg-gradient-to-r", info.color)} style={{ width: item.percentage }} />
                           </div>
                        </motion.div>
                      );
                    })}
                    {(!stats?.mediaDistribution || stats.mediaDistribution.length === 0) && (
                      <div className="col-span-3 text-center py-24 space-y-4 opacity-40">
                         <Search className="w-12 h-12 mx-auto" />
                         <p className="text-sm font-medium">Faça sua primeira pesquisa para ver as porcentagens reais.</p>
                      </div>
                    )}
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
