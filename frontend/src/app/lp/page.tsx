"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  LineChart
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/ui/InstagramIcon";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const features = [
    {
      title: "IA de Diagnóstico Viral",
      description: "Nossa inteligência identifica padrões de crescimento e sentimentos do público em segundos.",
      icon: Sparkles,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Analíticos Avançados",
      description: "Gráficos de rosca e barras profissionais para você visualizar a distribuição de mídia.",
      icon: BarChart3,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Radar de Hashtags",
      description: "Descubra as hashtags que estão dominando o nicho antes da concorrência.",
      icon: Target,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      title: "Relatórios em PDF",
      icon: LineChart,
      description: "Exporte análises estratégicas profissionais prontas para enviar a clientes.",
      color: "text-green-500",
      bg: "bg-green-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      {/* Glow Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 opacity-30" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full -z-10 opacity-20" />

      {/* Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter italic">VIRYON <span className="text-primary text-sm not-italic ml-1">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
          </div>
          <Link href="/login">
            <button className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all active:scale-95">
              Entrar
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Nova Inteligência de Mercado</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.1]"
          >
            Minere o Ouro do <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Instagram</span> com IA.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            O Viryon analisa nichos, descobre tendências virais e entrega diagnósticos de performance em segundos. Pare de chutar e comece a escalar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full px-10 h-16 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
                COMEÇAR AGORA <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-slate-800" />
              ))}
              <div className="pl-4 text-xs font-medium text-slate-500">
                +1.2k usuários ativos
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="recursos" className="py-32 bg-white/[0.02] border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">O que você vai dominar</h2>
            <p className="text-slate-400">Ferramentas de elite para quem não aceita resultados comuns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-[#0a0a0f] border border-white/5 rounded-[2.5rem] group hover:border-primary/20 transition-all"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.bg, feature.color)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/20 to-accent/10 border border-white/10 rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Instagram className="w-40 h-40" />
          </div>
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
          <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter">
            "Detectamos um padrão viral no nicho de Sustentabilidade. Perfis que usam vídeos de 'Bastidores' estão tendo 3.2x mais engajamento."
          </h3>
          <p className="text-slate-400 font-medium">— IA Viryon processando tendências reais</p>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section id="precos" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic">Escolha seu nível de jogo</h2>
            <p className="text-slate-400 text-lg">Planos flexíveis para quem busca escala real no Instagram.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Plan 1: Starter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8 backdrop-blur-md"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-300">Starter</h3>
                <p className="text-sm text-slate-500 font-medium">Ideal para iniciantes</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">R$</span>
                <span className="text-6xl font-black tracking-tighter">47</span>
                <span className="text-slate-500 font-bold">/mês</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> 10 Pesquisas /mês
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> IA de Insights Básica
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Histórico de 30 dias
                </li>
              </ul>
              <Link href="/register" className="block">
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all">
                  COMEÇAR AGORA
                </button>
              </Link>
            </motion.div>

            {/* Plan 2: PRO (Featured) */}
            <motion.div 
              initial={{ opacity: 0, y: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, y: -20, scale: 1.05 }}
              viewport={{ once: true }}
              className="p-10 bg-gradient-to-b from-primary/30 to-primary/10 border-2 border-primary/50 rounded-[3rem] space-y-8 backdrop-blur-xl relative z-10 shadow-[0_0_50px_rgba(139,92,246,0.2)]"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">OFERTA DE LANÇAMENTO</div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">PROFISSIONAL</h3>
                <p className="text-sm text-primary font-bold uppercase tracking-widest">Mais Vendido</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">R$</span>
                <span className="text-7xl font-black tracking-tighter">97</span>
                <span className="text-slate-300 font-bold">/mês</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-white font-medium">
                  <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Pesquisas Ilimitadas
                </li>
                <li className="flex items-center gap-3 text-sm text-white font-medium">
                  <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> IA Avançada de Sentimentos
                </li>
                <li className="flex items-center gap-3 text-sm text-white font-medium">
                  <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Exportação de PDFs
                </li>
                <li className="flex items-center gap-3 text-sm text-white font-medium">
                  <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Radar de Hashtags
                </li>
              </ul>
              <Link href="/register" className="block">
                <button className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/40 transition-all hover:scale-105">
                  ASSINAR AGORA
                </button>
              </Link>
            </motion.div>

            {/* Plan 3: Elite */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8 backdrop-blur-md"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-300">Elite / Agência</h3>
                <p className="text-sm text-slate-500 font-medium">Dominação total</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">R$</span>
                <span className="text-6xl font-black tracking-tighter">197</span>
                <span className="text-slate-500 font-bold">/mês</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Tudo do Plano PRO
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Suporte VIP Priority
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Acesso Antecipado a Betas
                </li>
              </ul>
              <Link href="/register" className="block">
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all">
                  ENTRAR PARA O ELITE
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-10 text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">
            <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500" /> Pagamento 100% Seguro</span>
            <span className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" /> Resultados Comprovados</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Garantia Incondicional</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6 text-center text-slate-600 text-sm">
        <p>&copy; 2026 Viryon Intelligence Systems. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
