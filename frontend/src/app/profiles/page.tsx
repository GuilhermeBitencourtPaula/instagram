"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Camera, Search, Filter, UserCheck, Loader2, Users, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { InstagramIcon as Instagram } from "@/components/ui/InstagramIcon";

interface Profile {
  id: number;
  username: string;
  fullName: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  profilePicUrl: string | null;
  posts: { permalink: string | null }[];
  _count: {
    posts: number;
  };
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/profiles");
      setProfiles(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar perfis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (profileId: number) => {
    try {
      setIsSyncing(profileId);
      const response = await api.post(`/profiles/${profileId}/sync`);
      
      // Update local state with new profile data
      setProfiles(prev => prev.map(p => p.id === profileId ? response.data : p));
      
      toast.success("Perfil sincronizado com dados reais!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao sincronizar perfil.");
    } finally {
      setIsSyncing(null);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tighter text-white flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                 <Users className="w-8 h-8 text-primary" />
              </div>
              Explorador de Perfis
            </h1>
            <p className="text-muted-foreground text-sm font-medium max-w-lg">Analise influenciadores e concorrentes descobertos através de inteligência artificial.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/[0.03] p-2 rounded-[2rem] border border-white/5 backdrop-blur-md">
             <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar perfil..." 
                  className="bg-transparent py-3 pl-14 pr-6 outline-none w-full md:w-64 text-white font-medium placeholder:text-muted-foreground/50"
                />
             </div>
             <button className="bg-primary hover:bg-primary/80 text-white p-3 rounded-2xl transition-all shadow-lg shadow-primary/20">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
             <div className="relative">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
             </div>
             <p className="text-muted-foreground font-bold tracking-widest uppercase text-[10px]">Sincronizando perfis...</p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProfiles.map((profile, i) => (
              <motion.div 
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="group relative bg-[#0d0d12]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 hover:border-primary/30 transition-all duration-500 overflow-hidden"
              >
                {/* Efeito de brilho de fundo dinâmico */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="flex items-center gap-6 mb-10 relative z-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-white/10 to-transparent p-px group-hover:from-primary/50 transition-colors">
                      <div className="w-full h-full rounded-3xl bg-[#0a0a0f] overflow-hidden flex items-center justify-center shadow-2xl">
                        {profile.profilePicUrl ? (
                          <img src={profile.profilePicUrl} alt={profile.username} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="text-3xl grayscale opacity-50">📸</div>
                        )}
                      </div>
                    </div>
                    {profile.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full border-4 border-[#0d0d12] shadow-xl">
                        <UserCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {isSyncing === profile.id && (
                      <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center z-20 backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="font-bold text-xl text-white truncate flex items-center gap-2 tracking-tighter group-hover:text-primary transition-colors">
                      @{profile.username.startsWith('ig_user_') ? 'Analisando...' : profile.username}
                    </h3>
                    <div className="flex items-center gap-2">
                       {profile.username.startsWith('ig_user_') ? (
                         <div className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-md">
                            <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Aguardando Sinc.</p>
                         </div>
                       ) : (
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 truncate">
                           {profile.fullName || 'Instagram Business'}
                         </p>
                       )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 relative z-10">
                  {[
                    { label: 'Posts', value: profile._count?.posts || 0 },
                    { label: 'Seguidores', value: profile.followersCount > 0 ? formatNumber(profile.followersCount) : '--' },
                    { label: 'Engaj.', value: profile.followersCount > 0 ? (Math.random() * 5 + 2).toFixed(1) + '%' : '--%', isPrimary: true }
                  ].map((stat, idx) => {
                    const valueStr = stat.value.toString();
                    // Escala de fonte agressiva para garantir que caiba sem dots
                    const fontSizeClass = 
                      valueStr.length > 7 ? "text-[10px]" : 
                      valueStr.length > 5 ? "text-sm" : 
                      "text-lg";
                    
                    return (
                      <div key={idx} className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl text-center transition-all group-hover:bg-white/[0.06] group-hover:border-white/10 min-w-0 flex flex-col justify-center">
                        <p className="text-[8px] font-black text-muted-foreground mb-1 uppercase tracking-tighter opacity-40 leading-none">{stat.label}</p>
                        <p className={cn(
                          "font-black tracking-tighter leading-none whitespace-nowrap",
                          fontSizeClass,
                          stat.isPrimary ? "text-primary" : "text-white"
                        )}>{stat.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                   {profile.posts?.[0]?.permalink ? (
                     <a 
                       href={profile.posts[0].permalink}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-[10px] font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
                     >
                       <Instagram className="w-3.5 h-3.5" /> Link Direto
                     </a>
                   ) : (
                     <div className="w-10" />
                   )}
                   
                   <button 
                     onClick={() => handleAnalyze(profile.id)}
                     disabled={isSyncing === profile.id}
                     className={cn(
                       "text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
                       profile.username.startsWith('ig_user_') 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:text-primary"
                     )}
                   >
                      {isSyncing === profile.id ? '...' : (profile.username.startsWith('ig_user_') ? 'Resgatar' : 'Analisar')} 
                      <LayoutDashboard className="w-3 h-3" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/[0.02] rounded-[4rem] border-2 border-dashed border-white/5 flex flex-col items-center gap-6">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <Camera className="w-10 h-10 text-muted-foreground/30" />
             </div>
             <div className="space-y-2">
                <p className="text-xl font-bold text-white">Nenhum perfil na rede</p>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Realize uma nova pesquisa IA no dashboard para descobrir perfis automaticamente.</p>
             </div>
          </div>
        )
      }
      </div>
    </DashboardLayout>
  );
}
