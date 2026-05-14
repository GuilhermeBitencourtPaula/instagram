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
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">VIR<span className="text-orange-500">YON</span></span>
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
        </div>
      </nav>

      {/* Hero Section - A HEADLINE */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-orange-500/10 blur-[120px] rounded-full opacity-20 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] border border-orange-500/20 mb-6 inline-block">
              Inteligência Artificial para Instagram
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              DOMINE O MERCADO COM <br />
              <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                DADOS DE ELITE.
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              A Viryon transforma milhões de interações no Instagram em insights estratégicos. Pare de adivinhar e comece a escalar com inteligência real.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/register">
              <Button className="h-16 px-10 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-lg font-black shadow-2xl shadow-orange-500/20 group">
                ACESSAR PAINEL AGORA
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#beneficios">
              <Button variant="outline" className="h-16 px-10 border-white/10 hover:bg-white/5 rounded-2xl text-lg font-bold text-slate-300">
                Ver Demonstração
              </Button>
            </Link>
          </motion.div>

          {/* Preview do Sistema */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-slate-900/50 border border-white/10 rounded-[2rem] p-4 backdrop-blur-sm overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000" 
                 alt="Dashboard Preview" 
                 className="rounded-xl grayscale-[0.2] opacity-80 group-hover:opacity-100 transition-all duration-700"
               />
               {/* Overlay de Vidro Simulado */}
               <div className="absolute bottom-10 left-10 right-10 p-8 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                       <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                       <p className="text-xs font-black text-orange-500 uppercase">Análise em Tempo Real</p>
                       <p className="text-xl font-bold">12,482 Perfis Monitorados</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
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
      <section id="beneficios" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Por que o Viryon é <span className="text-orange-500">inevitável?</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">Não entregamos apenas dados. Entregamos vantagem competitiva injusta.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-900/30 border border-white/5 hover:border-orange-500/20 transition-all group">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-8 shadow-xl shadow-orange-500/10`}>
                  <b.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">{b.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Sobre Curta */}
      <section id="sobre" className="py-20 bg-slate-900/10">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-6">
               <h2 className="text-4xl font-black tracking-tight">Construído para a <br /> <span className="text-orange-500">Nova Era da Análise.</span></h2>
               <p className="text-slate-400 text-lg leading-relaxed font-medium">
                 A Viryon nasceu da necessidade de transformar o Instagram de uma rede social em uma fonte de dados pura. Nossa infraestrutura utiliza processamento paralelo e inteligência artificial para garantir que você esteja sempre à frente.
               </p>
               <ul className="space-y-4">
                  {["API Oficial Instagram Graph", "Processamento em Nuvem", "IA Generativa Própria"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-slate-300 font-bold">
                       <CheckCircle2 className="h-5 w-5 text-orange-500" />
                       {item}
                    </li>
                  ))}
               </ul>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
               <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 text-center">
                  <p className="text-4xl font-black text-orange-500 mb-1">99%</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Precisão de Dados</p>
               </div>
               <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 text-center mt-8">
                  <p className="text-4xl font-black text-white mb-1">2.4s</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tempo de Resposta</p>
               </div>
            </div>
         </div>
      </section>

      {/* Prova Social - DEPOIMENTOS */}
      <section className="py-32 px-6">
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-black tracking-tight mb-20 text-white">O que dizem os <span className="text-orange-500">Big Players.</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                 <div key={i} className="p-12 rounded-[3rem] bg-slate-900/40 border border-white/5 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <InstagramIcon className="h-20 w-20 text-white" />
                    </div>
                    <div className="flex gap-1 mb-6">
                       {[...Array(d.stars)].map((_, i) => <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />)}
                    </div>
                    <p className="text-xl font-medium text-slate-300 italic mb-8 relative z-10">"{d.text}"</p>
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-full bg-slate-800 border border-orange-500/30" />
                       <div>
                          <p className="font-black text-white">{d.name}</p>
                          <p className="text-xs font-bold text-slate-500 uppercase">{d.role}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer / CTA Final */}
      <footer className="py-32 border-t border-white/5 relative overflow-hidden">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-orange-500/10 blur-[100px] rounded-full opacity-10 pointer-events-none" />
         
         <div className="max-w-4xl mx-auto text-center space-y-12 px-6">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">Pronto para elevar seu <br /> <span className="text-orange-500">jogo estratégico?</span></h2>
            <Link href="/register">
              <Button className="h-20 px-16 bg-white text-black hover:bg-slate-200 rounded-3xl text-xl font-black shadow-2xl shadow-white/10 group">
                COMEÇAR TESTE GRÁTIS
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <div className="pt-20 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-white/5">
               <div className="flex items-center gap-2">
                 <Shield className="h-5 w-5 text-orange-500" />
                 <span className="text-xl font-black tracking-tighter">VIR<span className="text-orange-500">YON</span></span>
               </div>
               <p className="text-slate-500 text-sm font-medium">© 2026 Viryon Intelligence. Todos os direitos reservados.</p>
               <div className="flex items-center gap-6 text-slate-400 text-sm font-bold">
                  <a href="#" className="hover:text-white">Termos</a>
                  <a href="#" className="hover:text-white">Privacidade</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
