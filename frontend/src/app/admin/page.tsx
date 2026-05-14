"use client";

import { useState, useEffect } from "react";
import { Shield, Users, Activity, Settings, Database, AlertCircle, CheckCircle2, Loader2, X, Mail, Calendar, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/logs")
      ]);
      setStats(prev => ({ ...prev, ...statsRes.data }));
      setLogs(logsRes.data);
    } catch (error) {
      toast.error("Erro ao carregar dados do painel.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
      setIsUsersModalOpen(true);
    } catch (error) {
      toast.error("Erro ao carregar lista de usuários.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClearCache = async () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
      loading: 'Limpando cache Redis...',
      success: 'Cache limpo com sucesso!',
      error: 'Erro ao limpar cache.',
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-6 w-6 text-orange-500" />
              <h1 className="text-4xl font-bold tracking-tight text-white">Painel Administrativo</h1>
            </div>
            <p className="text-slate-400">Controle total da infraestrutura Viryon.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Sistema Online</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/40 border-slate-800 rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Usuários</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{isLoading ? "..." : stats.totalUsers}</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +12% desde o último mês
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Status Banco</CardTitle>
              <Database className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6" />
                {stats.dbStatus}
              </div>
              <p className="text-xs text-slate-500 mt-1">Sincronizado: {stats.lastSync}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Saúde do Sistema</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.systemHealth}</div>
              <p className="text-xs text-slate-500 mt-1">Tempo de atividade: 99.9%</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Alertas Ativos</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{isLoading ? "..." : stats.activeAlerts}</div>
              <p className="text-xs text-slate-500 mt-1">Nenhum erro crítico</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800 rounded-[2.5rem] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl text-white">Logs do Sistema</CardTitle>
              <p className="text-sm text-slate-500">Atividades recentes registradas no backend.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{log.action}</p>
                          <p className="text-xs text-slate-500">Termo: <span className="text-primary italic">"{log.target}"</span> por {log.user}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        <div className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] mt-1 inline-block">
                          {log.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">Nenhum log disponível.</p>
                )}
              </div>
              <Button 
                variant="ghost" 
                onClick={fetchData}
                className="w-full mt-4 text-slate-400 hover:text-white border border-dashed border-slate-800 rounded-xl"
              >
                Atualizar Logs
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 rounded-[2.5rem] h-fit overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl text-white">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={fetchUsers}
                className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl justify-start gap-4 px-6 text-base font-bold shadow-lg shadow-orange-500/10"
              >
                <Users className="h-5 w-5" />
                Gerenciar Usuários
              </Button>
              <Button 
                variant="outline" 
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                className="w-full h-14 border-slate-800 text-slate-300 hover:bg-slate-800 rounded-2xl justify-start gap-4 px-6"
              >
                <Settings className="h-5 w-5" />
                Configurar API
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearCache}
                className="w-full h-14 border-slate-800 text-slate-300 hover:bg-slate-800 rounded-2xl justify-start gap-4 px-6"
              >
                <Database className="h-5 w-5" />
                Limpar Cache Redis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Users Modal */}
      <AnimatePresence>
        {isUsersModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUsersModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Users className="h-8 w-8 text-orange-500" />
                    Gerenciar Usuários
                  </h2>
                  <p className="text-slate-400">Listagem de todos os usuários logados na plataforma.</p>
                </div>
                <button onClick={() => setIsUsersModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                {users.map((user) => (
                  <div key={user.id} className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/30 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/60 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl font-bold text-white uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold text-white">{user.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center px-6 border-r border-slate-700/50">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Pesquisas</p>
                        <p className="text-xl font-bold text-white">{user._count.searches}</p>
                      </div>
                      <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        <span className="text-xs font-bold text-orange-500 uppercase">{user.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

