"use client";

import { useState, useEffect } from "react";
import { Shield, Users, Activity, Settings, Database, AlertCircle, CheckCircle2, Loader2, Mail, Calendar, Search, ArrowRight, MoreVertical, ExternalLink, Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    searches: number;
  }
}

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSearches: 0,
    activeAlerts: 0,
    dbStatus: "Ativo",
    systemHealth: "100%",
    lastSync: new Date().toLocaleTimeString()
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, logsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/logs"),
        api.get("/admin/users")
      ]);
      setStats(prev => ({ ...prev, ...statsRes.data }));
      setLogs(logsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error("Erro ao carregar dados do painel.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowDetails = async (userId: number) => {
    setIsDetailLoading(true);
    setIsDetailsOpen(true);
    try {
      const res = await api.get(`/admin/users/${userId}`);
      setSelectedUser(res.data);
    } catch (error) {
      toast.error("Erro ao carregar detalhes do usuário.");
      setIsDetailsOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-[1.5rem] bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Centro de Comando</h1>
                <p className="text-slate-500 text-sm font-medium">Monitoramento e Gestão Administrativa Viryon</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={fetchData} 
            className="bg-slate-900 border border-slate-800 text-white rounded-2xl h-14 px-8 gap-3 hover:bg-slate-800 transition-all font-bold"
          >
            <Activity className={`h-5 w-5 text-orange-500 ${isLoading ? 'animate-spin' : ''}`} />
            Sincronizar Infraestrutura
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Usuários Ativos", val: stats.totalUsers, icon: Users, trend: "+12%", color: "text-orange-500" },
            { label: "Database Health", val: stats.dbStatus, icon: Database, trend: "Sync OK", color: "text-green-500" },
            { label: "Uptime do Sistema", val: stats.systemHealth, icon: Activity, trend: "Estável", color: "text-blue-500" },
            { label: "Monitoramentos", val: stats.activeAlerts, icon: AlertCircle, trend: "Em Tempo Real", color: "text-purple-500" }
          ].map((s, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl hover:border-orange-500/30 transition-colors group">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-slate-950/50 border border-slate-800 group-hover:border-orange-500/20 transition-all`}>
                    <s.icon className={`h-6 w-6 ${s.color}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500 bg-slate-950/50 px-3 py-1 rounded-full border border-slate-800">
                    {s.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                  <p className="text-4xl font-black text-white">{isLoading ? "..." : s.val}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabela de Usuários - Container com Scroll */}
        <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Usuário</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plano</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Última Atividade</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                   Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="p-8 h-20 bg-white/[0.01]" />
                      </tr>
                   ))
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        user.role === 'ADMIN' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6">
                       <div className="space-y-0.5">
                          <p className="text-sm font-black text-white">{user._count.searches}</p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Pesquisas</p>
                       </div>
                    </td>
                    <td className="p-6 text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleShowDetails(user.id)}
                        className="bg-white/5 hover:bg-white text-muted-foreground hover:text-black px-4 py-2 rounded-xl text-[10px] font-black transition-all active:scale-95 border border-white/5 whitespace-nowrap"
                      >
                        VER DETALHES
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Secondary Info: Logs Grid */}
        <section className="space-y-6">
           <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Clock className="h-6 w-6 text-orange-500" />
              Linha do Tempo do Sistema
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {logs.map((log) => (
                <div key={log.id} className="p-6 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 space-y-5 hover:border-orange-500/20 transition-all group">
                   <div className="flex justify-between items-start">
                      <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <Activity className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <div className="space-y-1">
                      <p className="text-lg font-bold text-white leading-tight">{log.action}</p>
                      <p className="text-xs text-slate-500 font-medium">Alvo: <span className="text-orange-500 font-bold">"{log.target}"</span></p>
                   </div>
                   <div className="flex items-center gap-3 pt-4 border-t border-slate-800/30">
                      <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                         {log.user.charAt(0)}
                      </div>
                      <p className="text-xs font-bold text-slate-400">{log.user}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {isDetailsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <button onClick={() => setIsDetailsOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-full transition-colors">
                <X className="h-6 w-6 text-slate-500" />
              </button>

              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                   <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
                   <p className="text-slate-400 font-black uppercase tracking-widest">Compilando dossiê...</p>
                </div>
              ) : selectedUser && (
                <div className="space-y-8">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-orange-500/20">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-4xl font-black text-white">{selectedUser.name}</h3>
                      <p className="text-slate-400 font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {selectedUser.email}
                      </p>
                      <div className="flex items-center gap-3 mt-4">
                         <span className="px-4 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                            {selectedUser.role}
                         </span>
                         <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                           selectedUser.instagramConfig?.isConnected ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                         }`}>
                           {selectedUser.instagramConfig?.isConnected ? 'IG CONECTADO' : 'IG DESCONECTADO'}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-white flex items-center gap-2">
                      <Activity className="h-5 w-5 text-orange-500" />
                      Atividade Recente (Top 5)
                    </h4>
                    <div className="space-y-3">
                      {selectedUser.searches?.length > 0 ? selectedUser.searches.map((s: any) => (
                        <div key={s.id} className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 flex justify-between items-center group hover:border-orange-500/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                               <InstagramIcon className="h-5 w-5 text-slate-500 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-white tracking-tight">"{s.query}"</p>
                              <p className="text-[10px] text-slate-600 font-bold uppercase">{new Date(s.createdAt).toLocaleDateString()} • {s._count.posts} posts</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                            s.status === 'COMPLETED' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-orange-500 border-orange-500/20 bg-orange-500/5'
                          }`}>
                            {s.status}
                          </div>
                        </div>
                      )) : (
                        <p className="text-center py-10 text-slate-600 font-medium italic border border-dashed border-slate-800 rounded-3xl">Nenhuma pesquisa realizada ainda.</p>
                      )}
                    </div>
                  </div>

                  <Button className="w-full h-16 bg-white text-black hover:bg-slate-200 rounded-3xl font-black text-lg gap-3 transition-all shadow-xl shadow-white/5">
                     Enviar Notificação Direta
                     <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}



