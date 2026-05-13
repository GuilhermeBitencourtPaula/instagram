"use client";

import { useState, useEffect } from "react";
import { Bookmark, Search, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { toast } from "sonner";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/profiles/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      await api.delete(`/profiles/favorites/${id}`);
      setFavorites(favorites.filter((f: any) => f.id !== id));
      toast.success("Removido dos favoritos");
    } catch (error) {
      toast.error("Erro ao remover favorito");
    }
  };

  const filteredFavorites = favorites.filter((f: any) => 
    f.profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.profile.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Favoritos</h1>
            <p className="text-slate-400 mt-1">Perfis monitorados e salvos para análise rápida.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Buscar nos favoritos..." 
              className="pl-10 bg-slate-900/50 border-slate-800 text-white focus:border-orange-500/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-900/50 rounded-xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((fav: any) => (
              <Card key={fav.id} className="bg-slate-900/40 border-slate-800 hover:border-orange-500/30 transition-all duration-300 group overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500 font-bold">
                    {fav.profile.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-white truncate">
                      @{fav.profile.username}
                    </CardTitle>
                    <p className="text-xs text-slate-500 truncate">{fav.profile.fullName || 'Instagram Profile'}</p>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[10px]">
                    {fav.profile.followersCount.toLocaleString()} seg
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 text-xs text-slate-400 line-clamp-2 italic h-8">
                    {fav.notes || "Sem notas adicionadas."}
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => removeFavorite(fav.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-800 text-slate-300 hover:bg-slate-800"
                      asChild
                    >
                      <a href={`/profiles/${fav.profile.username}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Perfil
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
            <Bookmark className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">Nenhum favorito encontrado</h3>
            <p className="text-slate-500 mt-2">Os perfis que você favoritar aparecerão aqui.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
