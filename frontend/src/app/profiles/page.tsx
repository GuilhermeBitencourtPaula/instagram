"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Camera, Search, Filter, UserCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";

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
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Camera className="w-8 h-8 text-primary" />
              Explorador de Perfis
            </h1>
            <p className="text-muted-foreground">Encontre e analise influenciadores e concorrentes descobertos nas suas buscas.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <button className="bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl transition-all">
                <Filter className="w-5 h-5 text-white" />
             </button>
             <div className="relative group flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar perfil..." 
                  className="bg-card/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/40 transition-all w-full md:w-64 text-white"
                />
             </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
             <Loader2 className="w-12 h-12 text-primary animate-spin" />
             <p className="text-muted-foreground animate-pulse">Carregando inteligência de perfis...</p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile, i) => (
              <motion.div 
                key={profile.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card/40 border border-white/5 rounded-[2rem] p-6 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[50px] rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-2xl overflow-hidden shadow-inner">
                    {profile.profilePicUrl ? (
                      <img src={profile.profilePicUrl} alt={profile.username} className="w-full h-full object-cover" />
                    ) : (
                      "📸"
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                      @{profile.username}
                      {profile.isVerified && <UserCheck className="w-4 h-4 text-blue-400" />}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {profile.fullName || 'Perfil do Instagram'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center relative z-10">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-bold">Posts</p>
                    <p className="font-bold text-sm text-white">{profile._count.posts}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-bold">Seguidores</p>
                    <p className="font-bold text-sm text-white">
                      {profile.followersCount >= 1000 
                        ? `${(profile.followersCount / 1000).toFixed(1)}k` 
                        : profile.followersCount}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-bold">Engaj.</p>
                    <p className="font-bold text-sm text-primary">--%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card/20 rounded-[2rem] border border-dashed border-white/10">
             <p className="text-muted-foreground">Nenhum perfil encontrado. Tente realizar uma nova pesquisa no dashboard.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
