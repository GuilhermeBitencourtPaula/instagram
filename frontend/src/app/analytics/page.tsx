"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, PieChart, Loader2, Search, FileText, Zap, LayoutDashboard, Camera } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Stats {
  totalSearches: number;
  totalPosts: number;
  totalInsights: number;
  avgEngagement: string;
  followersCount: number;
  mediaDistribution: { type: string; percentage: string }[];
  topTags: { name: string; count: number }[];
}

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ReTooltip,
  Sector
} from 'recharts';

function AnalyticsContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const profileFilter = searchParams.get("profile");

  useEffect(() => {
    fetchStats();
  }, [profileFilter]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const url = profileFilter 
        ? `/searches/stats?username=${profileFilter.replace('@', '')}` 
        : "/searches/stats";
        
      const response = await api.get(url);
      setStats(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar estatísticas.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e'];
  
  const chartData = (stats?.mediaDistribution || []).map(item => ({
    name: item.type === 'CAROUSEL_ALBUM' ? 'Carrossel' : item.type === 'IMAGE' ? 'Fotos' : 'Vídeos',
    value: parseFloat(item.percentage),
    originalType: item.type
  }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            {profileFilter ? `Analíticos: @${profileFilter.replace('@', '')}` : 'Analíticos Avançados'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {profileFilter 
              ? `Visão detalhada de performance para o perfil selecionado.` 
              : 'Visão geral de performance e crescimento de nichos coletados.'}
          </p>
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
                        {stats?.followersCount ? formatNumber(stats.followersCount) : '0'}
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
              <div className="md:col-span-2 bg-card/40 border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col">
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
                 
                 <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
                    <div className="h-[300px] w-full relative">
                       <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                             <ReTooltip 
                               content={({ active, payload }) => {
                                 if (active && payload && payload.length) {
                                   return (
                                     <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{payload[0].name}</p>
                                       <p className="text-2xl font-black text-white">{payload[0].value}%</p>
                                     </div>
                                   );
                                 }
                                 return null;
                               }}
                             />
                             <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                                onMouseEnter={onPieEnter}
                                onMouseLeave={() => setActiveIndex(null)}
                             >
                                {chartData.map((_, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                             </Pie>
                          </RePieChart>
                       </ResponsiveContainer>
                       {/* Center Info */}
                       <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Média Total</p>
                          <p className="text-3xl font-black text-white">100%</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       {chartData.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                <div>
                                   <p className="text-sm font-bold text-white">{item.name}</p>
                                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Porcentagem Real</p>
                                </div>
                             </div>
                             <div className="text-xl font-black text-white">{item.value}%</div>
                          </div>
                       ))}
                       {chartData.length === 0 && (
                          <div className="text-center py-10 opacity-40">
                             <p className="text-sm">Sem dados de mídia disponíveis.</p>
                          </div>
                       )}
                    </div>
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

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
           <Loader2 className="w-12 h-12 text-primary animate-spin" />
           <p className="text-muted-foreground mt-4">Carregando painel de inteligência...</p>
        </div>
      </DashboardLayout>
    }>
      <AnalyticsContent />
    </Suspense>
  );
}
