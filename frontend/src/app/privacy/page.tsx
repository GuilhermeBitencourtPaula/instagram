"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-orange-500/30">
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-orange-500 transition-colors" />
            <span className="font-bold text-white">Voltar para o site</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-500" />
            <span className="text-xl font-black tracking-tighter text-white">VIR<span className="text-orange-500">YON</span></span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Política de <span className="text-orange-500">Privacidade.</span></h1>
            <p className="text-slate-500 font-medium text-sm italic">Última atualização: 14 de Maio de 2026</p>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">1. Coleta de Dados</h2>
            <p className="leading-relaxed">
              O Viryon coleta apenas as informações necessárias para fornecer nossos serviços de inteligência de mercado. Isso inclui informações básicas de perfil quando você se registra e dados públicos do Instagram via API oficial para análise.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">2. Uso das Informações</h2>
            <p className="leading-relaxed">
              As informações coletadas são usadas exclusivamente para gerar relatórios de tendências, insights de engajamento e monitoramento de perfis. Não vendemos seus dados para terceiros.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">3. Exclusão de Dados</h2>
            <p className="leading-relaxed bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl">
              <strong className="text-orange-500 block mb-2 underline">Instruções para Exclusão de Dados:</strong>
              Para solicitar a exclusão total de seus dados e o desvínculo de sua conta do Instagram de nossa plataforma, você pode enviar um e-mail para <span className="text-white font-bold">bitencourtpaula.guilherme@gmail.com</span> com o assunto "Exclusão de Dados". Processaremos sua solicitação em até 48 horas úteis.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">4. Segurança</h2>
            <p className="leading-relaxed">
              Utilizamos criptografia SSL de 256 bits e seguimos as melhores práticas da LGPD para garantir que seus dados permaneçam seguros em nossa infraestrutura baseada em nuvem.
            </p>
          </section>

          <footer className="pt-12 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm">© 2026 Viryon Intelligence. Todos os direitos reservados.</p>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
