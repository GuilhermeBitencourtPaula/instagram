"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Trash2, 
  Zap, 
  Search, 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  BarChart2
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RecentSearch {
  id: number;
  query: string;
  createdAt: string;
  status: string;
  isFavorite: boolean;
  _count: { posts: number };
}

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Buscar todas as pesquisas
  const { data: searches, isLoading } = useQuery<RecentSearch[]>({
    queryKey: ['all-searches'],
    queryFn: async () => (await api.get("/searches")).data,
  });

  // Mutação para apagar tudo
  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await api.delete("/searches");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-searches'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success("Todo o histórico foi limpo com sucesso!");
      setIsClearModalOpen(false);
    },
    onError: () => {
      toast.error("Erro ao limpar histórico.");
      setIsClearModalOpen(false);
    }
  });

  // Mutação para apagar uma única
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/searches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-searches'] });
      toast.success("Pesquisa removida.");
    }
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <Link href="/dashboard" className="text-muted-foreground hover:text-white flex items-center gap-2 text-sm transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Voltar ao Início
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <History className="w-8 h-8 text-primary" />
              Histórico Completo
            </h1>
            <p className="text-muted-foreground">Gerencie todas as suas inteligências coletadas.</p>
          </div>

          {(searches || []).length > 0 && (
            <button 
              onClick={() => setIsClearModalOpen(true)}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black text-sm transition-all flex items-center gap-2 group"
            >
              <Trash2 className="w-4 h-4" />
              LIMPAR HISTÓRICO
            </button>
          )}
        </div>

        {/* Search List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse font-medium">Recuperando registros...</p>
            </div>
          ) : (searches || []).length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {searches?.map((search, i) => (
                <motion.div
                  key={search.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card/40 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Zap className={cn(
                        "w-7 h-7",
                        search.status === 'COMPLETED' ? "text-yellow-500" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        {search.query}
                        {search.isFavorite && <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded-full">FAV</span>}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(search.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <BarChart2 className="w-3.5 h-3.5" />
                          {search._count?.posts || 0} posts
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <span className={cn(
                      "text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest",
                      search.status === 'COMPLETED' ? "bg-green-500/10 text-green-500 border border-green-500/20" : 
                      search.status === 'FAILED' ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
                      "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                    )}>
                      {search.status}
                    </span>
                    
                    <button 
                      onClick={() => deleteMutation.mutate(search.id)}
                      className="p-3 bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-card/20 border border-dashed border-white/10 p-24 rounded-[3rem] text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-white">Seu histórico está limpo</p>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Você ainda não realizou nenhuma pesquisa de inteligência.
                </p>
              </div>
              <Link href="/search">
                <button className="px-8 py-3 bg-white text-black rounded-2xl font-black text-sm hover:scale-105 transition-all">
                  COMEÇAR AGORA
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Limpeza em Massa */}
      <AnimatePresence>
        {isClearModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsClearModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center">
                   <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Limpar tudo?</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    Você está prestes a apagar permanentemente todas as suas pesquisas e inteligências coletadas.
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3 mt-4">
                   <button
                     onClick={() => clearHistoryMutation.mutate()}
                     disabled={clearHistoryMutation.isPending}
                     className="w-full h-14 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                     {clearHistoryMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "APAGAR TODO O HISTÓRICO"}
                   </button>
                   <button
                     onClick={() => setIsClearModalOpen(false)}
                     className="w-full h-14 bg-transparent hover:bg-white/5 text-slate-400 rounded-2xl font-bold text-sm transition-all"
                   >
                     MANTER REGISTROS
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
