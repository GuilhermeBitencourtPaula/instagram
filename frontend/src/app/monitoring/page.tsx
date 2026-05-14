"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Activity, Bell, Clock, Plus, Loader2, X, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Alert {
  id: number;
  query: string;
  cronExpression: string;
  isActive: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
}

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  // Form states
  const [query, setQuery] = useState("");
  const [frequency, setFrequency] = useState("hourly");

  const fetchAlerts = async () => {
    try {
      const response = await api.get("/monitoring");
      setAlerts(response.data);
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
      toast.error("Não foi possível carregar seus alertas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleOpenModal = (alert: Alert | null = null) => {
    if (alert) {
      setEditingAlert(alert);
      setQuery(alert.query);
      setFrequency(alert.cronExpression.includes("0 0 * * *") ? "daily" : "hourly");
    } else {
      setEditingAlert(null);
      setQuery("");
      setFrequency("hourly");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingAlert) {
        await api.patch(`/monitoring/${editingAlert.id}`, { query, frequency });
        toast.success("Alerta atualizado com sucesso!");
      } else {
        await api.post("/monitoring", { query, frequency });
        toast.success("Novo alerta configurado!");
      }
      setIsModalOpen(false);
      fetchAlerts();
    } catch (error) {
      toast.error("Erro ao salvar alerta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (alert: Alert) => {
    try {
      const newStatus = !alert.isActive;
      await api.patch(`/monitoring/${alert.id}`, { isActive: newStatus });
      setAlerts(alerts.map(a => a.id === alert.id ? { ...a, isActive: newStatus } : a));
      toast.success(newStatus ? "Alerta ativado!" : "Alerta pausado.");
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este alerta?")) return;
    try {
      await api.delete(`/monitoring/${id}`);
      setAlerts(alerts.filter(a => a.id !== id));
      toast.success("Alerta removido.");
    } catch (error) {
      toast.error("Erro ao remover alerta.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              Monitoramento Ativo
            </h1>
            <p className="text-muted-foreground">Acompanhe hashtags e concorrentes em tempo real.</p>
          </div>
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-primary text-white px-6 py-6 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 h-auto"
          >
            <Plus className="w-5 h-5" />
            Novo Alerta
          </Button>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Sincronizando sua rede...</p>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((item) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id} 
                className="bg-card/40 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between hover:bg-white/5 transition-all gap-6"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div 
                    onClick={() => toggleStatus(item)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${item.isActive ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                  >
                     <Bell className={`w-6 h-6 ${item.isActive ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        {item.query}
                        {!item.isActive && <span className="text-[10px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-tighter">Pausado</span>}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {item.cronExpression.includes("0 0 * * *") ? "Diário" : "A cada 1h"}
                      </span>
                      {item.lastRunAt && (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Última checagem: {new Date(item.lastRunAt).toLocaleTimeString()}
                        </span>
                      )}
                      {item.isActive && item.nextRunAt && (
                         <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                            Próxima: {new Date(item.nextRunAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                   <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${item.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-muted-foreground border border-white/5'}`}>
                      {item.isActive ? 'Ativo' : 'Pausado'}
                   </div>
                   <button 
                    onClick={() => handleOpenModal(item)}
                    className="text-xs font-bold text-muted-foreground hover:text-white transition-colors"
                   >
                        Configurar
                   </button>
                   <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                   >
                        <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-16 text-center space-y-6">
             <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <Activity className="w-12 h-12 text-primary relative z-10 mx-auto mt-4" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Nenhum monitoramento configurado</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Comece a acompanhar hashtags ou concorrentes para receber insights estratégicos automaticamente.</p>
             </div>
             <Button 
                onClick={() => handleOpenModal()}
                variant="outline" 
                className="rounded-xl border-primary/20 text-primary hover:bg-primary/10"
             >
                Configurar Primeiro Alerta
             </Button>
          </div>
        )}
      </div>

      {/* Alert Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingAlert ? "Configurar Alerta" : "Novo Alerta IA"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Defina o que você deseja monitorar e com qual frequência.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Hashtag ou Concorrente</label>
                    <Input 
                      placeholder="Ex: #marketingdigital ou @user_concorrente"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Frequência de Checagem</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFrequency("hourly")}
                          className={`p-4 rounded-2xl border transition-all text-left group ${frequency === "hourly" ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/20"}`}
                        >
                            <Clock className={`w-5 h-5 mb-2 ${frequency === "hourly" ? "text-primary" : "group-hover:text-white"}`} />
                            <p className="text-sm font-bold">Cada 1h</p>
                            <p className="text-[10px] opacity-60 italic">Tempo Real</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFrequency("daily")}
                          className={`p-4 rounded-2xl border transition-all text-left group ${frequency === "daily" ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/20"}`}
                        >
                            <Activity className={`w-5 h-5 mb-2 ${frequency === "daily" ? "text-primary" : "group-hover:text-white"}`} />
                            <p className="text-sm font-bold">Diário</p>
                            <p className="text-[10px] opacity-60 italic">Resumo do dia</p>
                        </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        editingAlert ? "Salvar Alterações" : "Ativar Monitoramento"
                      )}
                    </Button>
                    {editingAlert && (
                       <button
                        type="button"
                        onClick={() => { handleDelete(editingAlert.id); setIsModalOpen(false); }}
                        className="w-full mt-4 text-xs font-bold text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest"
                       >
                         Remover este monitoramento
                       </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

