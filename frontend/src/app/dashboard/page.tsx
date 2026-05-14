"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Search, 
  Zap,
  Plus,
  History,
  Sparkles,
  Loader2,
  Trash2,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardStats {
  totalSearches: number;
  totalPosts: number;
  totalInsights: number;
  avgEngagement: string;
}

interface RecentSearch {
  id: number;
  query: string;
  createdAt: string;
  status: string;
  isFavorite: boolean;
  _count: { posts: number };
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  // Queries...
  const { data: stats, isLoading: loadingStats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get("/searches/stats")).data,
    staleTime: 1000 * 60 * 5,
  });

  const { data: searches, isLoading: loadingSearches } = useQuery<RecentSearch[]>({
    queryKey: ['recent-searches'],
    queryFn: async () => (await api.get("/searches")).data,
    staleTime: 1000 * 60 * 2,
  });

  // Mutação para deletar pesquisa
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/searches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success("Pesquisa removida com sucesso");
      setDeleteModal({ isOpen: false, id: null });
    },
    onError: () => {
      toast.error("Erro ao remover pesquisa");
      setDeleteModal({ isOpen: false, id: null });
    }
  });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = () => {
    if (deleteModal.id) {
      deleteMutation.mutate(deleteModal.id);
    }
  };

  const statsConfig = [
    { label: "Pesquisas Realizadas", value: stats?.totalSearches || 0, icon: Search, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Posts Analisados", value: stats?.totalPosts || 0, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Insights da IA", value: stats?.totalInsights || 0, icon: Sparkles, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Engajamento Médio", value: stats?.avgEngagement || "0%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Olá, {user?.name?.split(' ')[0] || 'Pesquisador'} <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-muted-foreground">Resumo da sua inteligência de mercado hoje.</p>
          </div>
          <Link href="/search">
            <button className="bg-white text-black px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-white/90 transition-all shadow-lg active:scale-95">
                <Plus className="w-5 h-5" />
                Nova Pesquisa
            </button>
          </Link>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingStats ? (
             Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-card/40 border border-white/5 p-6 rounded-[2rem] h-32 animate-pulse" />
             ))
          ) : (
            statsConfig.map((stat, i) => (
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
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+Realtime</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
            ))
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <History className="w-5 h-5 text-primary" />
                Pesquisas Recentes
              </h2>
              <Link href="/monitoring" className="text-sm text-primary hover:underline">Ver todas</Link>
            </div>
            
            <div className="space-y-4">
              {loadingSearches ? (
                 <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                 </div>
              ) : (searches || []).length > 0 ? (
                (searches || []).slice(0, 5).map((search) => (
                    <div key={search.id} className="bg-card/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                        <h4 className="font-bold text-white">Busca: {search.query}</h4>
                        <p className="text-xs text-muted-foreground">
                            {new Date(search.createdAt).toLocaleDateString()} • {search._count?.posts || 0} posts coletados
                        </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                               search.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : 
                               search.status === 'FAILED' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                            }`}>
                               {search.status}
                            </span>
                            {search.isFavorite && (
                               <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Favorito</span>
                            )}
                        </div>
                        <button 
                          onClick={(e) => handleDeleteClick(e, search.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2.5 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                           {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                    </div>
                ))
              ) : (
                <div className="bg-card/20 border border-dashed border-white/10 p-12 rounded-[2rem] text-center">
                   <p className="text-muted-foreground">Nenhuma pesquisa realizada ainda.</p>
                   <Link href="/search" className="text-primary font-bold text-sm mt-2 block">Começar agora</Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-accent" />
              IA Sugestões
            </h2>
            <div className="bg-gradient-to-br from-accent/20 to-primary/10 border border-accent/20 p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700" />
              <p className="text-sm text-white/90 leading-relaxed relative z-10 italic font-medium">
                "Detectamos um padrão viral no nicho de Sustentabilidade. Perfis que usam vídeos de 'Bastidores' estão tendo <strong>3.2x mais engajamento</strong> que a média."
              </p>
              <Link href="/search">
                <button className="mt-6 w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:scale-[1.02] transition-all relative z-10">
                    Analisar agora
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão Customizado */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ isOpen: false, id: null })}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Trash2 className="h-24 w-24 text-white" />
              </div>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                   <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">Excluir Pesquisa?</h3>
                  <p className="text-sm text-slate-400 font-medium">
                    Esta ação é permanente e removerá todos os dados coletados desta busca.
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3">
                   <button
                     onClick={confirmDelete}
                     disabled={deleteMutation.isPending}
                     className="w-full h-14 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                     {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "SIM, EXCLUIR AGORA"}
                   </button>
                   <button
                     onClick={() => setDeleteModal({ isOpen: false, id: null })}
                     className="w-full h-14 bg-transparent hover:bg-white/5 text-slate-400 rounded-2xl font-bold text-sm transition-all"
                   >
                     CANCELAR
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
