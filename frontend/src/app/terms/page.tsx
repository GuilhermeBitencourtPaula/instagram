"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-orange-500/30">
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-orange-500 transition-colors" />
            <span className="font-bold text-white">Voltar para o site</span>
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-orange-500" />
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
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Termos de <span className="text-orange-500">Serviço.</span></h1>
            <p className="text-slate-500 font-medium text-sm italic">Última atualização: 14 de Maio de 2026</p>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">1. Aceitação dos Termos</h2>
            <p className="leading-relaxed">
              Ao acessar e utilizar a plataforma Viryon, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">2. Uso da Licença</h2>
            <p className="leading-relaxed">
              É concedida permissão para baixar temporariamente uma cópia dos materiais na plataforma Viryon, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">3. Isenção de Responsabilidade</h2>
            <p className="leading-relaxed">
              Os materiais na plataforma Viryon são fornecidos 'como estão'. O Viryon não oferece garantias, expressas ou implícitas, e por este meio isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">4. Uso de APIs de Terceiros</h2>
            <p className="leading-relaxed">
              O Viryon utiliza a API oficial do Instagram (Meta). Ao usar nossa plataforma, você também concorda em cumprir os Termos de Serviço do Instagram e do Facebook.
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
