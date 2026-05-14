"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Zap, Target, TrendingUp, CheckCircle2, Star, ArrowRight, BarChart3, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Viryon Logo" className="h-8 w-8 md:h-10 md:w-10 rounded-xl shadow-lg shadow-orange-500/20" />
            <span className="text-xl md:text-2xl font-black tracking-tighter">VIR<span className="text-orange-500">YON</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400">
            <a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a>
            <a href="#sobre" className="hover:text-white transition-colors">Tecnologia</a>
            <Link href="/login">
              <Button variant="ghost" className="text-slate-400 hover:text-white">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 shadow-lg shadow-orange-500/20">
                Começar Agora
              </Button>
            </Link>
          </div>
          {/* Mobile Login Button - Simple for now */}
          <div className="md:hidden">
            <Link href="/login">
              <Button size="sm" className="bg-orange-500 text-white rounded-full text-xs font-bold px-4">Entrar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - A HEADLINE */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-orange-500/10 blur-[120px] rounded-full opacity-20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-orange-500/20 mb-4 md:mb-6 inline-block">
              Inteligência Artificial para Instagram
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-6 md:mb-8">
              DOMINE O MERCADO COM <br />
              <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                DADOS DE ELITE.
              </span>
            </h1>
            <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-2">
              A Viryon transforma milhões de interações no Instagram em insights estratégicos. Pare de adivinhar e comece a escalar com inteligência real.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full h-14 md:h-16 px-8 md:px-10 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-base md:text-lg font-black shadow-2xl shadow-orange-500/20 group">
                ACESSAR PAINEL AGORA
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#beneficios" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-14 md:h-16 px-8 md:px-10 border-white/10 hover:bg-white/5 rounded-2xl text-base md:text-lg font-bold text-slate-300">
                Ver Demonstração
              </Button>
            </Link>
          </motion.div>

          {/* Preview do Sistema */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 md:mt-16 relative group max-w-4xl mx-auto overflow-hidden sm:overflow-visible"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-600/20 rounded-[1.5rem] md:rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-[#0a0a0a] border border-white/5 rounded-[1rem] md:rounded-[1.5rem] p-1 md:p-2 backdrop-blur-sm overflow-hidden">
               <img 
                 src="/dashboard-final.png" 
                 alt="Viryon Instagram Intelligence Dashboard" 
                 className="rounded-lg md:rounded-xl opacity-90 group-hover:opacity-100 transition-all duration-700 w-full h-auto"
               />
               {/* Overlay de Vidro Simulado - Oculto em Mobile muito pequeno */}
               <div className="hidden sm:flex absolute bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10 p-4 md:p-8 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-orange-500 flex items-center justify-center">
                       <BarChart3 className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="text-left">
                       <p className="text-[8px] md:text-xs font-black text-orange-500 uppercase">Análise em Tempo Real</p>
                       <p className="text-sm md:text-xl font-bold">12,482 Perfis Monitorados</p>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                     <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-950 bg-slate-800" />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção Benefícios - A LISTA DE 3 */}
      <section id="beneficios" className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white px-2">Por que o Viryon é <span className="text-orange-500">inevitável?</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm md:text-base">Não entregamos apenas dados. Entregamos vantagem competitiva injusta.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "IA de Pesquisa Profunda",
                desc: "Nossa inteligência escaneia nichos inteiros em segundos, encontrando as tendências antes que elas virem 'mainstream'.",
                icon: Zap,
                color: "from-orange-500 to-red-500"
              },
              {
                title: "Decisões Baseadas em Dados",
                desc: "Esqueça o 'eu acho'. Saiba exatamente quais conteúdos estão convertendo e quais perfis estão crescendo de verdade.",
                icon: Target,
                color: "from-blue-500 to-indigo-600"
              },
              {
                title: "Escalabilidade Ilimitada",
                desc: "Monitore centenas de concorrentes e hashtags simultaneamente sem perder um único detalhe estratégico.",
                icon: TrendingUp,
                color: "from-green-500 to-emerald-600"
              }
            ].map((b, i) => (
              <div key={i} className="p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-900/30 border border-white/5 hover:border-orange-500/20 transition-all group">
                <div className={`h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-6 md:mb-8 shadow-xl shadow-orange-500/10`}>
                  <b.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-white">{b.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-sm md:text-base">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Sobre Curta */}
      <section id="sobre" className="py-16 md:py-20 bg-slate-900/10 px-4 md:px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 space-y-4 md:space-y-6">
               <h2 className="text-3xl md:text-4xl font-black tracking-tight">Construído para a <br /> <span className="text-orange-500">Nova Era da Análise.</span></h2>
               <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                 A Viryon nasceu da necessidade de transformar o Instagram de uma rede social em uma fonte de dados pura. Nossa infraestrutura utiliza processamento paralelo e inteligência artificial para garantir que você esteja sempre à frente.
               </p>
               <ul className="space-y-3 md:space-y-4">
                  {["API Oficial Instagram Graph", "Processamento em Nuvem", "IA Generativa Própria"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-slate-300 font-bold text-sm md:text-base">
                       <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                       {item}
                    </li>
                  ))}
               </ul>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
               <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-slate-900/40 border border-white/5 text-center">
                  <p className="text-3xl md:text-4xl font-black text-orange-500 mb-1">99%</p>
                  <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Precisão de Dados</p>
               </div>
               <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-slate-900/40 border border-white/5 text-center mt-4 md:mt-8">
                  <p className="text-3xl md:text-4xl font-black text-white mb-1">2.4s</p>
                  <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Tempo de Resposta</p>
               </div>
            </div>
         </div>
      </section>

      {/* Prova Social - DEPOIMENTOS */}
      <section className="py-16 md:py-32 px-4 md:px-6 text-center">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-12 md:mb-20 text-white px-2">O que dizem os <span className="text-orange-500">Big Players.</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
               {[
                 {
                   name: "Guilherme Paula",
                   role: "CEO na GP Marketing",
                   text: "O Viryon mudou a forma como fazemos pesquisa de mercado. O que levava dias, agora fazemos em minutos com uma precisão assustadora.",
                   stars: 5
                 },
                 {
                   name: "Ricardo Silva",
                   role: "Estrategista Digital",
                   text: "A melhor ferramenta de inteligência competitiva que já usei. A interface é linda e os dados são extremamente confiáveis.",
                   stars: 5
                 }
               ].map((d, i) => (
                 <div key={i} className="p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-slate-900/40 border border-white/5 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
                       <InstagramIcon className="h-12 w-12 md:h-20 md:w-20 text-white" />
                    </div>
                    <div className="flex gap-1 mb-4 md:mb-6">
                       {[...Array(d.stars)].map((_, i) => <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-orange-500 text-orange-500" />)}
                    </div>
                    <p className="text-base md:text-xl font-medium text-slate-300 italic mb-6 md:mb-8 relative z-10">"{d.text}"</p>
                    <div className="flex items-center gap-3 md:gap-4">
                       <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-slate-800 border border-orange-500/30" />
                       <div>
                          <p className="font-black text-sm md:text-base text-white">{d.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">{d.role}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer / CTA Final */}
      <footer className="py-16 md:py-32 border-t border-white/5 relative overflow-hidden px-4 md:px-6">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-orange-500/10 blur-[100px] rounded-full opacity-10 pointer-events-none" />
         
         <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 relative px-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight px-2">Pronto para elevar seu <br /> <span className="text-orange-500">jogo estratégico?</span></h2>
            <Link href="/register" className="w-full sm:w-auto inline-block">
              <Button className="w-full sm:w-auto h-16 md:h-20 px-8 md:px-16 bg-white text-black hover:bg-slate-200 rounded-2xl md:rounded-3xl text-lg md:text-xl font-black shadow-2xl shadow-white/10 group">
                COMEÇAR TESTE GRÁTIS
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <div className="pt-12 md:pt-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 border-t border-white/5">
               <div className="flex items-center gap-2">
                 <Shield className="h-5 w-5 text-orange-500" />
                 <span className="text-xl font-black tracking-tighter">VIR<span className="text-orange-500">YON</span></span>
               </div>
               <p className="text-slate-500 text-[10px] md:text-sm font-medium">© 2026 Viryon Intelligence. Todos os direitos reservados.</p>
               <div className="flex items-center gap-4 md:gap-6 text-slate-400 text-xs md:text-sm font-bold">
                  <a href="#" className="hover:text-white">Termos</a>
                  <a href="#" className="hover:text-white">Privacidade</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
