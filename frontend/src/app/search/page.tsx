"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search as SearchIcon, 
  Sparkles, 
  Info, 
  History, 
  ArrowRight, 
  Loader2,
  ArrowLeft,
  LayoutGrid,
  Zap,
  TrendingUp,
  Target,
  Star,
  Lock,
  AlertCircle
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/ui/InstagramIcon";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";
import { toast } from "sonner";
import ResultCard from "@/components/search/ResultCard";
import AiInsightsCard from "@/components/analytics/AiInsightsCard";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<"likes" | "recent">("likes");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await api.get("/instagram/status");
        setIsConnected(res.data.isConnected);
      } catch (error) {
        console.error("Erro ao verificar conexão:", error);
        setIsConnected(false);
      }
    };
    checkConnection();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !isConnected) return;

    setIsSearching(true);
    try {
      // 1. Criar e processar a pesquisa padrão
      const createResponse = await api.post("/searches", { 
        query, 
        tagNames: []
      });
      
      const searchId = createResponse.data.id;
      const processResponse = await api.post(`/searches/${searchId}/process`);
      
      setResults(processResponse.data.search);
      setIsFavorite(false);

      // 2. Tentar gerar insights de IA avançados via Instagram API
      try {
        const statusRes = await api.get("/instagram/status");
        if (statusRes.data.isConnected) {
          const aiRes = await api.post("/instagram/gerar-analise-ia", {
            accessToken: statusRes.data.config.accessToken,
            facebookPageId: statusRes.data.config.instagramUserId,
            hashtag: query.replace(/\s+/g, '') // Remove espaços para a hashtag
          });
          
          if (aiRes.data.success) {
            setAiInsight(aiRes.data.insight);
          }
        }
      } catch (aiError) {
        console.warn("IA avançada não disponível ou conta não conectada:", aiError);
      }
      
      toast.success("Análise concluída com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error("Ocorreu um erro ao processar sua pesquisa. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFavorite = async () => {
    if (!results) return;
    
    const newFavoriteStatus = !isFavorite;
    try {
      await api.patch(`/searches/${results.id}/favorite`, { isFavorite: newFavoriteStatus });
      setIsFavorite(newFavoriteStatus);
      toast.success(newFavoriteStatus ? "Adicionado aos favoritos!" : "Removido dos favoritos.");
    } catch (error) {
      toast.error("Erro ao atualizar favoritos.");
    }
  };

  const resetSearch = () => {
    setResults(null);
    setAiInsight(null);
    setQuery("");
  };

  const showSearchTip = () => {
    toast.info("Dica Estratégica", {
      description: "Para melhores resultados, use termos específicos como 'Moda Fitness Feminina' em vez de apenas 'Moda'. A IA analisa melhor nichos bem definidos.",
      duration: 6000,
    });
  };

  if (results) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
               <button 
                onClick={resetSearch}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
               >
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  Resultados: <span className="text-primary italic">"{results.query}"</span>
                </h1>
                <p className="text-muted-foreground">Análise estratégica baseada em {results.posts?.length || 0} posts.</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <Button 
                variant="outline" 
                onClick={toggleFavorite}
                className={`rounded-xl border-white/10 flex items-center gap-2 ${isFavorite ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}`}
               >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-500' : ''}`} />
                  {isFavorite ? 'Favoritado' : 'Favoritar'}
               </Button>
               <Button className="rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                  Exportar Relatório
               </Button>
            </div>
          </header>

          {/* AI Insights Section */}
          {aiInsight ? (
            <AiInsightsCard 
              hashtag={aiInsight.hashtag}
              sentiment={aiInsight.sentiment}
              trends={aiInsight.trends}
              suggestions={aiInsight.suggestions}
              createdAt={aiInsight.createdAt}
            />
          ) : (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-gradient-to-br from-primary/20 to-accent/5 via-[#0d0d12] border border-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full w-fit">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Sumário da IA</span>
                     </div>
                     <p className="text-lg text-white/90 leading-relaxed font-medium italic">
                        "{results.insights?.[0]?.summary || 'Gerando resumo...'}"
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <div className="space-y-1">
                           <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                              <TrendingUp className="w-3.5 h-3.5 text-green-400" /> Tendências
                           </h4>
                           <p className="text-sm text-white/80">{results.insights?.[0]?.detectedTrends}</p>
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                              <Target className="w-3.5 h-3.5 text-accent" /> Nicho Sugerido
                           </h4>
                           <p className="text-sm text-white/80">{results.insights?.[0]?.suggestedNiche}</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center space-y-6">
                  <div className="space-y-2">
                     <div className="p-3 bg-yellow-500/10 rounded-2xl w-fit text-yellow-500">
                        <Zap className="w-6 h-6" />
                     </div>
                     <h3 className="text-xl font-bold text-white">Padrões Virais</h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        {results.insights?.[0]?.viralPatterns}
                     </p>
                  </div>
               </div>
            </section>
          )}

          {/* Posts Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                  Posts Encontrados
               </h2>
               <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Ordenar por:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#1a1a23] border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-white outline-none cursor-pointer hover:border-primary transition-colors"
                  >
                     <option value="likes">Mais Curtidas</option>
                     <option value="recent">Mais Recentes</option>
                  </select>
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.posts
                ?.sort((a: any, b: any) => {
                  if (sortBy === "likes") return b.likesCount - a.likesCount;
                  return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
                })
                .map((post: any) => (
                  <ResultCard key={post.id} post={post} />
                ))}
            </div>
          </section>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-12 text-center px-4">
        {isConnected === false ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/40 border border-white/10 p-10 rounded-[2.5rem] space-y-6 max-w-lg shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto text-primary">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Conexão Necessária</h2>
              <p className="text-muted-foreground">
                Para realizar pesquisas de mercado reais e extrair insights da IA, você precisa conectar sua conta do Instagram Business primeiro.
              </p>
            </div>
            <Link href="/settings">
              <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg flex items-center justify-center gap-2 mt-4">
                <Instagram className="w-5 h-5" />
                Conectar Agora
              </Button>
            </Link>
          </motion.div>
        ) : isConnected === null ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Verificando status da conta...</p>
          </div>
        ) : (
          <>
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

            <div className="w-full space-y-4">
              <form onSubmit={handleSearch} className="w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-card/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 pr-4 shadow-2xl">
                  <div className="flex-1 flex items-center px-4 md:px-6">
                    <SearchIcon className="w-6 h-6 text-muted-foreground mr-4" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ex: Moda Sustentável, Dropshipping de Relógios..."
                      className="w-full bg-transparent border-none text-lg md:text-xl text-white placeholder:text-muted-foreground/50 focus:ring-0 outline-none py-4"
                      disabled={isSearching}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="rounded-full px-6 md:px-8 py-5 md:py-6 h-auto whitespace-nowrap"
                    disabled={!query.trim() || isSearching}
                  >
                    {isSearching ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <span className="hidden md:inline">Analisar com IA</span>
                        <span className="md:hidden">Analisar</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Disclaimer Notice */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest px-4 py-2 bg-white/5 border border-white/5 rounded-full w-fit mx-auto"
              >
                <AlertCircle className="w-3 h-3 text-primary" />
                Os resultados são extraídos em tempo real via API Oficial do Instagram
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div 
                  onClick={showSearchTip}
                  className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 text-left border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                >
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <Info className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Dica de Busca</h4>
                        <p className="text-xs text-muted-foreground">Use termos específicos para melhores insights da IA.</p>
                    </div>
                </div>
                <Link href="/dashboard" className="w-full">
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 text-left border border-white/5 hover:bg-white/10 transition-all cursor-pointer group h-full">
                      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                          <History className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="text-sm font-bold">Ver Histórico</h4>
                          <p className="text-xs text-muted-foreground">Acesse suas pesquisas anteriores e insights salvos.</p>
                      </div>
                  </div>
                </Link>
            </div>
          </>
        )}

        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
            >
              <div className="space-y-6 text-center max-w-sm px-6">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Processando Inteligência...</h3>
                    <p className="text-muted-foreground animate-pulse leading-relaxed">
                        Coletando posts, analisando perfis e gerando insights estratégicos para o nicho de <span className="text-white font-bold italic">"{query}"</span>.
                    </p>
                    <p className="text-[10px] text-primary/60 uppercase tracking-widest mt-4">Conexão Segura Instagram Ativa</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

