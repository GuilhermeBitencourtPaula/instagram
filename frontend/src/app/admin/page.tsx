"use client";

import { useState, useEffect } from "react";
import { Shield, Users, Activity, Settings, Database, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";

export default function AdminPage() {
  const [stats, setStats] = useState({
    users: 0,
    searches: 0,
    dbStatus: "online",
    systemHealth: "100%",
    lastSync: new Date().toLocaleTimeString()
  });

  const [logs, setLogs] = useState([
    { id: 1, action: "User login", user: "admin@viryon.com", time: "2 mins ago", status: "success" },
    { id: 2, action: "API Scraping", user: "System", time: "15 mins ago", status: "success" },
    { id: 3, action: "Database Migration", user: "System", time: "1 hour ago", status: "success" }
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-orange-500" />
            <h1 className="text-3xl font-bold tracking-tight text-white">Painel Administrativo</h1>
          </div>
          <p className="text-slate-400">Controle total da infraestrutura Viryon.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Usuários</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +12% desde o último mês
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Status Banco</CardTitle>
              <Database className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Ativo
              </div>
              <p className="text-xs text-slate-500 mt-1">Sincronizado: {stats.lastSync}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Saúde do Sistema</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.systemHealth}</div>
              <p className="text-xs text-slate-500 mt-1">Tempo de atividade: 99.9%</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Alertas Ativos</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-slate-500 mt-1">Nenhum erro crítico</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Logs do Sistema</CardTitle>
              <p className="text-sm text-slate-500">Atividades recentes registradas no backend.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{log.action}</p>
                        <p className="text-xs text-slate-500">{log.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{log.time}</p>
                      <div className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[10px]">
                        {log.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-slate-400 hover:text-white border border-dashed border-slate-800">
                Ver todos os logs
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800 h-fit">
            <CardHeader>
              <CardTitle className="text-lg text-white">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white justify-start gap-2">
                <Users className="h-4 w-4" />
                Gerenciar Usuários
              </Button>
              <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-800 justify-start gap-2">
                <Settings className="h-4 w-4" />
                Configurar API
              </Button>
              <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-800 justify-start gap-2">
                <Database className="h-4 w-4" />
                Limpar Cache Redis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
