"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Camera, Search, Filter, UserCheck, Loader2, Users, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Profile {
  id: number;
  username: string;
  fullName: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  profilePicUrl: string | null;
  _count: {
    posts: number;
  };
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const filteredProfiles = profiles.filter(p => 
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                className="group relative bg-card/20 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 hover:border-primary/20 transition-all duration-500 overflow-hidden"
              >
                {/* Efeito de brilho de fundo */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="flex items-center gap-5 mb-10 relative z-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent p-0.5 border border-white/5 group-hover:border-primary/30 transition-colors">
                      <div className="w-full h-full rounded-[1.8rem] bg-card overflow-hidden flex items-center justify-center shadow-inner">
                        {profile.profilePicUrl ? (
                          <img src={profile.profilePicUrl} alt={profile.username} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">📸</div>
                        )}
                      </div>
                    </div>
                    {profile.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full border-4 border-[#0a0a0a] shadow-xl">
                        <UserCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-white flex items-center gap-2 tracking-tighter group-hover:text-primary transition-colors">
                      @{profile.username.length > 15 ? profile.username.substring(0, 12) + '...' : profile.username}
                    </h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                      {profile.fullName || 'INSTAGRAM USER'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 relative z-10">
                  {[
                    { label: 'Posts', value: profile._count.posts, color: 'from-purple-500/20' },
                    { label: 'Seguidores', value: profile.followersCount >= 1000 ? `${(profile.followersCount/1000).toFixed(1)}k` : profile.followersCount, color: 'from-blue-500/20' },
                    { label: 'Engaj.', value: '--%', color: 'from-rose-500/20', isPrimary: true }
                  ].map((stat, idx) => (
                    <div key={idx} className={cn(
                      "bg-white/[0.02] border border-white/5 p-4 rounded-[2rem] text-center transition-all group-hover:bg-white/[0.04]",
                      "hover:border-white/10"
                    )}>
                      <p className="text-[8px] font-black text-muted-foreground mb-1.5 uppercase tracking-widest opacity-40">{stat.label}</p>
                      <p className={cn(
                        "font-black text-lg tracking-tighter",
                        stat.isPrimary ? "text-primary" : "text-white"
                      )}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(j => (
                        <div key={j} className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-white/5 overflow-hidden">
                           <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent" />
                        </div>
                      ))}
                   </div>
                   <button className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                      Analisar Perfil <LayoutDashboard className="w-3 h-3" />
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
