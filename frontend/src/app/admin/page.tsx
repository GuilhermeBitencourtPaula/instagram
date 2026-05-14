"use client";

import { useState, useEffect } from "react";
import { Shield, Users, Activity, Settings, Database, AlertCircle, CheckCircle2, Loader2, Mail, Calendar, Search, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Shield className="h-7 w-7 text-orange-500" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Painel de Controle</h1>
            </div>
            <p className="text-slate-400">Gerenciamento central de usuários e infraestrutura.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button 
               onClick={fetchData} 
               variant="outline" 
               className="border-slate-800 rounded-2xl h-12 px-6 gap-2 hover:bg-slate-800"
             >
               <Activity className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
               Sincronizar Agora
             </Button>
          </div>
        </header>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/40 border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Usuários Registrados</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{isLoading ? "..." : stats.totalUsers}</div>
              <p className="text-xs text-green-500 flex items-center mt-2 font-medium">
                Crescimento de +12%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Status Infra</CardTitle>
              <Database className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6" />
                {stats.dbStatus}
              </div>
              <p className="text-xs text-slate-500 mt-2">Última checagem: {stats.lastSync}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Health Check</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{stats.systemHealth}</div>
              <p className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-widest">Uptime 99.9%</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Consultas Ativas</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{isLoading ? "..." : stats.activeAlerts}</div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Processamento Normal</p>
            </CardContent>
          </Card>
        </div>

        {/* Seção Principal: Gestão de Usuários */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Usuários da Plataforma</h2>
              <p className="text-slate-400 text-sm">Visualize e gerencie todos os acessos em tempo real.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Buscar por nome ou e-mail..." 
                className="pl-11 h-12 bg-slate-900/50 border-slate-800 rounded-2xl focus:ring-orange-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
                <p className="text-slate-500 font-medium">Carregando base de usuários...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={user.id} 
                  className="p-6 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-900/50 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                      {user.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">{user.name}</h4>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-400">
                        <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500" /> {user.email}</span>
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-500" /> Desde {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 px-4">
                    <div className="text-center px-8 border-r border-slate-800/50">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Pesquisas</p>
                      <p className="text-2xl font-bold text-white">{user._count.searches}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-widest border border-orange-500/20">
                         {user.role}
                       </span>
                       <button className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold">
                          Detalhes <ArrowRight className="h-3 w-3" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center bg-slate-900/20 rounded-[2rem] border border-dashed border-slate-800">
                <Users className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Nenhum usuário encontrado para "{searchQuery}"</p>
              </div>
            )}
          </div>
        </section>

        {/* Logs Recentes */}
        <section className="pt-8 border-t border-slate-800/50">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Atividades Recentes
              </h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {logs.map((log) => (
                <div key={log.id} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/50 space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">
                        {log.status}
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(log.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white">{log.action}</p>
                      <p className="text-xs text-slate-400 mt-1">Busca: <span className="text-orange-500">"{log.target}"</span></p>
                   </div>
                   <div className="pt-4 border-t border-slate-800/50 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-white">
                        {log.user.charAt(0)}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{log.user}</span>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </DashboardLayout>
  );
}


