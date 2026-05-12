"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Sparkles, Info, History, ArrowRight, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate process
    setTimeout(() => setIsSearching(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            IA Powered Research
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            O que vamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">descobrir</span> hoje?
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Digite um nicho, marca ou palavra-chave e nossa IA coletará e analisará as maiores tendências do Instagram para você.
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-card/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 pr-4 shadow-2xl">
            <div className="flex-1 flex items-center px-6">
              <SearchIcon className="w-6 h-6 text-muted-foreground mr-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Moda Sustentável, Dropshipping de Relógios..."
                className="w-full bg-transparent border-none text-xl text-white placeholder:text-muted-foreground/50 focus:ring-0 outline-none py-4"
              />
            </div>
            <Button 
              type="submit" 
              className="rounded-full px-8 py-6 h-auto"
              disabled={!query || isSearching}
            >
              {isSearching ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Analisar com IA
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 text-left border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Info className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold">Dica de Busca</h4>
                    <p className="text-xs text-muted-foreground">Use termos específicos para melhores insights da IA.</p>
                </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 text-left border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                    <History className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold">Ver Histórico</h4>
                    <p className="text-xs text-muted-foreground">Acesse suas 124 pesquisas anteriores.</p>
                </div>
            </div>
        </div>

        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
            >
              <div className="space-y-6 text-center max-w-sm">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Processando Inteligência...</h3>
                    <p className="text-muted-foreground animate-pulse">Coletando posts, analisando perfis e gerando insights estratégicos.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
