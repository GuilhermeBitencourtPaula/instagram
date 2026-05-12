"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, ExternalLink, User } from "lucide-react";
import { InstagramPost } from "@/types/search";

interface ResultCardProps {
  post: InstagramPost;
  username: string;
}

export default function ResultCard({ post, username }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-card/40 border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all group"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        {post.mediaUrl ? (
          <img 
            src={post.mediaUrl} 
            alt={post.caption || "Instagram Post"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sem Mídia
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
            Ver Original <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 uppercase tracking-tighter">
          {post.mediaType}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs font-bold text-white/80">@{username}</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Há 2 dias</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {post.caption || "Sem legenda disponível."}
        </p>

        <div className="flex items-center gap-6 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 group/stat">
            <Heart className="w-4 h-4 text-muted-foreground group-hover/stat:text-red-500 transition-colors" />
            <span className="text-xs font-bold text-white/90">{post.likesCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 group/stat">
            <MessageCircle className="w-4 h-4 text-muted-foreground group-hover/stat:text-blue-500 transition-colors" />
            <span className="text-xs font-bold text-white/90">{post.commentsCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
