"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface Post {
  instagramPostId: string;
  caption: string;
  mediaUrl: string;
  mediaType: string;
  likesCount: number;
  commentsCount: number;
  username: string;
  permalink: string;
  postedAt: string;
}

export default function ResultCard({ post }: { post: Post }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card/40 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all shadow-xl"
    >
      <div className="relative aspect-square bg-white/5 overflow-hidden">
         {post.mediaUrl ? (
           <img 
            src={post.mediaUrl} 
            alt={post.caption || "Instagram Post"} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop';
            }}
           />
         ) : (
           <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 group-hover:scale-110 transition-transform duration-700" />
         )}
         
         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
            <a 
              href={post.permalink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white text-black rounded-full shadow-xl hover:scale-110 transition-transform"
            >
               <ExternalLink className="w-5 h-5" />
            </a>
         </div>

         <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex gap-3">
               <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span className="text-[10px] font-bold text-white">
                    {post.likesCount > 999 ? `${(post.likesCount / 1000).toFixed(1)}k` : post.likesCount}
                  </span>
               </div>
               <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-bold text-white">{post.commentsCount}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-secondary" />
           <span className="text-xs font-bold text-white truncate max-w-[150px]">
             @{post.username.replace('ig_user_', '')}
           </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {post.caption || "Sem legenda."}
        </p>
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             {new Date(post.postedAt).toLocaleDateString('pt-BR')}
           </span>
           <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
              Ver Detalhes <Share2 className="w-3 h-3" />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
