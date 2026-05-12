"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Instagram, 
  CheckCircle2, 
  AlertCircle, 
  Link as LinkIcon, 
  Unlink, 
  RefreshCcw,
  ShieldCheck,
  Settings as SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getInstagramAuthUrl, getInstagramStatus, disconnectInstagram } from "@/lib/instagram";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await getInstagramStatus();
      setStatus(data);
    } catch (error) {
      console.error("Erro ao carregar status do Instagram", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setActionLoading(true);
      const url = await getInstagramAuthUrl();
      window.location.href = url;
    } catch (error) {
      toast.error("Erro ao iniciar conexão com Instagram");
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Tem certeza que deseja desconectar sua conta do Instagram? Isso interromperá as pesquisas automáticas.")) return;
    
    try {
      setActionLoading(true);
      await disconnectInstagram();
      await fetchStatus();
      toast.success("Instagram desconectado com sucesso");
    } catch (error) {
      toast.error("Erro ao desconectar Instagram");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10 px-6">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2">Gerencie suas conexões e preferências da plataforma.</p>
        </header>

        <div className="grid gap-8">
          {/* Instagram Connection Section */}
          <section className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Instagram size={160} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <Instagram className="text-white w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Integração com Instagram</h2>
                  <p className="text-sm text-muted-foreground">Conecte sua conta Business para realizar pesquisas IA.</p>
                </div>
              </div>

              {loading ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCcw className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground animate-pulse">Carregando status...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {status?.isConnected ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
                      
                      <div className="flex items-start gap-5 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="text-primary w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-white">Instagram Conectado</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Sua conta <span className="text-primary font-mono">{status.instagramUserId}</span> está ativa.
                          </p>
                          <div className="flex items-center gap-4 mt-6">
                             <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                               <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Expiração</p>
                               <p className="text-xs font-medium text-white">{new Date(status.expiresAt).toLocaleDateString()}</p>
                             </div>
                             <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                               <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Status do Token</p>
                               <p className="text-xs font-medium text-green-400">Ativo</p>
                             </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={handleDisconnect}
                          disabled={actionLoading}
                        >
                          <Unlink className="w-4 h-4 mr-2" />
                          Desconectar
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-10 text-center"
                    >
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LinkIcon className="text-muted-foreground/40 w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Pronto para começar?</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-10 text-sm">
                        Para utilizar as funcionalidades de pesquisa automatizada e inteligência de mercado, vincule sua conta do Instagram Business.
                      </p>
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:scale-[1.02] transition-all shadow-xl shadow-pink-500/10 border-0 h-14 px-10 text-white"
                        onClick={handleConnect}
                        disabled={actionLoading}
                      >
                        <Instagram className="w-6 h-6 mr-3" />
                        {actionLoading ? "Redirecionando..." : "Conectar Instagram Business"}
                      </Button>
                      
                      <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                         <div className="flex items-center gap-2 grayscale">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-4 h-4" alt="FB" />
                            <span className="text-[10px] font-bold">Facebook Login</span>
                         </div>
                         <div className="flex items-center gap-2 grayscale">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-bold">API Oficial</span>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                         <ShieldCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Segurança Total</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Utilizamos a API oficial do Meta. Seus dados estão protegidos e não solicitamos senhas.
                        </p>
                      </div>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                         <AlertCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Limites da Plataforma</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          A Meta impõe limites de 30 hashtags únicas por semana para garantir a integridade da API.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Account Settings Placeholder */}
          <section className="bg-card/20 border border-white/5 rounded-3xl p-8 group transition-all">
             <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Notificações Inteligentes</h2>
                   <p className="text-sm text-muted-foreground mt-1">Receba alertas de tendências via e-mail e Telegram.</p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Em breve</span>
                </div>
             </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
