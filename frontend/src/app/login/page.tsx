"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
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
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@instagramagent.com");
  const [password, setPassword] = useState("AdminSecurePassword123!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      setAuth(user, token);
      toast.success(`Bem-vindo de volta, ${user.name}!`);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha no login. Verifique suas credenciais.");
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
        {/* Abstract grid/lines can be added here with CSS or an SVG */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-8 left-8 z-50"
      >
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold tracking-tight">Voltar para o site</span>
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
        {/* Login Card */}
        <div className="relative group">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-blue-500/30 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-[#0d0d12]/60 backdrop-blur-3xl border border-white/10 p-10 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-20 h-20 bg-gradient-to-tr from-primary via-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/30"
                    >
                    <Camera className="text-white w-12 h-12" />
                    </motion.div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Viryon</span>
                    </h1>
                    <p className="text-muted-foreground/80 text-center text-sm font-medium">
                    Plataforma de pesquisa inteligente com IA para Instagram
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* E-mail Input */}
                    <div className="space-y-2">
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all outline-none"
                                placeholder="E-mail"
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
                                placeholder="Senha"
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

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-5 h-5 bg-black/40 border border-white/10 rounded flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                <div className="w-2.5 h-2.5 bg-primary rounded-sm opacity-0 group-hover:opacity-20 transition-opacity" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium group-hover:text-white transition-colors">Lembrar de mim</span>
                        </label>
                        <button type="button" className="text-xs text-muted-foreground hover:text-primary font-medium transition-colors">
                            Esqueci minha senha
                        </button>
                    </div>

                    {/* Login Button */}
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
                                    Entrar no Painel
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </button>

                    {/* Divider */}
                    <div className="relative py-4 flex items-center">
                        <div className="flex-1 border-t border-white/5" />
                        <span className="px-4 text-[10px] text-muted-foreground uppercase tracking-widest">ou continue com</span>
                        <div className="flex-1 border-t border-white/5" />
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="font-bold text-white text-sm">Continuar com Google</span>
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        Não tem uma conta? <Link href="/register" className="text-white font-bold hover:text-primary transition-colors ml-1">Registre-se agora</Link>
                    </p>
                </div>
            </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center space-y-2 opacity-40 hover:opacity-100 transition-opacity">
                <LockKeyhole className="w-5 h-5 text-white" />
                <p className="text-[10px] font-bold text-white uppercase tracking-tighter leading-tight">Dados protegidos<br/><span className="font-normal text-muted-foreground normal-case">com criptografia</span></p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 opacity-40 hover:opacity-100 transition-opacity">
                <ShieldCheck className="w-5 h-5 text-white" />
                <p className="text-[10px] font-bold text-white uppercase tracking-tighter leading-tight">Conexão segura<br/><span className="font-normal text-muted-foreground normal-case">SSL 256-bit</span></p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 opacity-40 hover:opacity-100 transition-opacity">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <p className="text-[10px] font-bold text-white uppercase tracking-tighter leading-tight">Privacidade garantida<br/><span className="font-normal text-muted-foreground normal-case">LGPD Compliant</span></p>
            </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
                <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.2em]">© 2024 Viryon AI</p>
                <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[10px] font-bold text-primary">v1.0.0</span>
            </div>
        </footer>
      </motion.div>
    </div>
  );
}
