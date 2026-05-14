"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User as UserIcon,
  ArrowRight, 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ShieldAlert, 
  LockKeyhole,
  CheckCircle2,
  Camera,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", { name, email, password });
      toast.success("Conta criada com sucesso! Você já pode fazer login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha no registro. Tente outro e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#050507] overflow-hidden font-sans selection:bg-primary/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse-subtle" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-subtle" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 md:top-8 left-6 md:left-8 z-50"
      >
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-xs md:text-sm font-bold tracking-tight">Voltar para o site</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 md:top-8 left-6 md:left-8 z-50"
      >
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-xs md:text-sm font-bold tracking-tight">Voltar para o site</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[520px] z-10 px-6 py-12"
      >
        {/* Register Card */}
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-blue-500/30 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-[#0d0d12]/60 backdrop-blur-3xl border border-white/10 p-10 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-16 h-16 bg-gradient-to-tr from-primary via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/30"
                    >
                    <Camera className="text-white w-10 h-10" />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Criar Conta <span className="text-primary">Viryon</span></h1>
                    <p className="text-muted-foreground/80 text-center text-sm font-medium">
                    Junte-se à revolução da inteligência de mercado.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <div className="relative group/input">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all outline-none"
                                placeholder="Nome Completo"
                                required
                            />
                        </div>
                    </div>

                    {/* E-mail Input */}
                    <div className="space-y-2">
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all outline-none"
                                placeholder="E-mail profissional"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all outline-none"
                                placeholder="Crie uma senha forte"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Terms */}
                    <p className="text-[10px] text-muted-foreground text-center px-4 leading-relaxed">
                        Ao se registrar, você concorda com nossos <span className="text-white cursor-pointer hover:underline">Termos de Serviço</span> e <span className="text-white cursor-pointer hover:underline">Política de Privacidade</span>.
                    </p>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative group/btn overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 group-hover:scale-105 transition-transform duration-500" />
                        <div className="relative w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-white tracking-wide active:scale-[0.98] transition-all disabled:opacity-70">
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Começar Agora Gratuitamente
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Já tem uma conta? <Link href="/login" className="text-white font-bold hover:text-primary transition-colors ml-1">Fazer Login</Link>
                    </p>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
