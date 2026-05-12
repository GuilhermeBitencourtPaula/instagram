"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Activity, Bell, Clock, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function MonitoringPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              Monitoramento Ativo
            </h1>
            <p className="text-muted-foreground">Acompanhe hashtags e concorrentes em tempo real.</p>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
            <Plus className="w-5 h-5" />
            Novo Alerta
          </button>
        </header>

        <div className="space-y-4">
          {[
            { tag: "#modafitness", status: "Ativo", lastRun: "há 5 min", frequency: "Cada 1h" },
            { tag: "@concorrente_A", status: "Pausado", lastRun: "há 2 dias", frequency: "Diário" },
          ].map((item, i) => (
            <div key={i} className="bg-card/40 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.status === 'Ativo' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                   <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{item.tag}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {item.frequency}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Última checagem: {item.lastRun}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${item.status === 'Ativo' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-muted-foreground border border-white/5'}`}>
                    {item.status}
                 </div>
                 <button className="text-xs font-bold text-muted-foreground hover:text-white transition-colors">Configurar</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-10 text-center space-y-4">
           <Activity className="w-12 h-12 text-primary mx-auto opacity-40" />
           <h3 className="text-xl font-bold text-white">Nenhuma atividade suspeita detectada</h3>
           <p className="text-muted-foreground max-w-md mx-auto">Sua rede de monitoramento está operando normalmente. Você será notificado assim que um novo padrão viral for identificado.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
