import React, { useState, useEffect } from 'react';
import { Lock, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function PasswordStrength() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    const calculateStrength = (pwd: string) => {
      let score = 0;
      const issues: string[] = [];

      if (pwd.length === 0) {
        setStrength(0);
        setFeedback([]);
        return;
      }

      if (pwd.length < 8) {
        issues.push('Mínimo de 8 caracteres');
      } else {
        score += 20;
      }

      if (/[A-Z]/.test(pwd)) score += 20;
      else issues.push('Adicione letras maiúsculas');

      if (/[a-z]/.test(pwd)) score += 20;
      else issues.push('Adicione letras minúsculas');

      if (/[0-9]/.test(pwd)) score += 20;
      else issues.push('Adicione números');

      if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
      else issues.push('Adicione caracteres especiais');

      setStrength(score);
      setFeedback(issues);
    };

    calculateStrength(password);
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-orange-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (strength === 0) return 'Digite uma senha';
    if (strength <= 20) return 'Muito Fraca';
    if (strength <= 40) return 'Fraca';
    if (strength <= 60) return 'Média';
    if (strength <= 80) return 'Forte';
    return 'Muito Forte';
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 sm:gap-8 h-full justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
          <Shield size={32} />
        </div>
        <h3 className="text-2xl font-black italic tracking-tighter sm:text-3xl mb-1">Validador de Senha</h3>
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text-main/30">Privacidade local total</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative group">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-5 pr-12 font-mono text-xl bg-bg-main border border-border-main rounded-[24px] focus:ring-4 focus:ring-text-main/5 outline-none transition-all shadow-inner"
            placeholder="Digite sua senha..."
          />
          <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-text-main/20 group-focus-within:text-text-main transition-colors" size={20} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-text-main/40">Força: <span className="text-text-main">{getStrengthLabel()}</span></span>
            <span className="opacity-40">{strength}%</span>
          </div>
          <div className="h-4 w-full bg-text-main/5 rounded-full overflow-hidden p-1 shadow-inner border border-border-main/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${strength}%` }}
              className={cn("h-full rounded-full transition-all duration-700", getStrengthColor())}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-card-main rounded-[28px] border border-border-main shadow-sm">
          <h4 className="text-[10px] font-black mb-4 uppercase tracking-[0.2em] text-text-main/40">Requisitos</h4>
          <div className="space-y-2.5">
            {feedback.length > 0 ? feedback.map((issue, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-red-500/80 font-bold uppercase tracking-wider">
                <AlertCircle size={14} />
                {issue}
              </div>
            )) : (
              <div className="flex items-center gap-2 text-xs text-green-500 font-bold uppercase tracking-wider">
                <CheckCircle2 size={14} />
                Senha Segura!
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-text-main text-bg-main rounded-[28px] shadow-xl">
          <h4 className="text-[10px] font-black mb-3 uppercase tracking-[0.2em] opacity-40">Segurança</h4>
          <p className="text-xs leading-relaxed font-medium opacity-80">
            Evite padrões óbvios. Frases longas com caracteres especiais são ideais.
          </p>
        </div>
      </div>
    </div>
  );
}
