"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  BrainCircuit,
  MessageCircle,
  Calendar,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AiInsightsCardProps {
  hashtag: string;
  sentiment: string;
  trends: string | string[];
  suggestions: string | string[];
  createdAt: string;
  isCached?: boolean;
}

export default function AiInsightsCard({ 
  hashtag, 
  sentiment, 
  trends, 
  suggestions, 
  createdAt,
  isCached 
}: AiInsightsCardProps) {
  
  // Converte strings em arrays se necessário
  const trendList = typeof trends === 'string' ? trends.split('\n').map(t => t.replace(/^\d+\.\s*/, '').trim()) : trends;
  const suggestionList = typeof suggestions === 'string' ? suggestions.split('\n').map(s => s.replace(/^\d+\.\s*/, '').trim()) : suggestions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition duration-500" />
      
      <div className="relative bg-[#0d0d12]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Análise de IA: #{hashtag}</h3>
                {isCached && (
                  <span className="text-[10px] bg-white/5 border border-white/10 text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                    Cache Ativo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs mt-0.5">
                <Calendar className="w-3 h-3" />
                {new Date(createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          
          <div className={cn(
            "px-4 py-2 rounded-xl border flex items-center gap-2 shadow-sm",
            "bg-primary/5 border-primary/20"
          )}>
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">Sentimento: {sentiment}</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trends Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/90">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-sm uppercase tracking-wider">Tendências Detectadas</h4>
            </div>
            <div className="space-y-3">
              {trendList.map((trend, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl group/item hover:bg-white/[0.05] transition-all"
                >
                  <div className="mt-1 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                  <p className="text-sm text-muted-foreground group-hover/item:text-white transition-colors leading-relaxed">
                    {trend}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suggestions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/90">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-sm uppercase tracking-wider">Sugestões de Conteúdo</h4>
            </div>
            <div className="space-y-3">
              {suggestionList.map((suggestion, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl group/item hover:bg-amber-500/[0.06] transition-all"
                >
                  <ChevronRight className="mt-0.5 w-4 h-4 text-amber-500/50 group-hover/item:text-amber-500 transition-colors" />
                  <p className="text-sm text-muted-foreground group-hover/item:text-white transition-colors leading-relaxed">
                    {suggestion}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <BrainCircuit className="w-4 h-4" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Análise gerada por Viryon Intelligence Engine</span>
          </div>
          <button className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
            Exportar PDF
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
