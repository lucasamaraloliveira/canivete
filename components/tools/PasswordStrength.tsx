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
    <div className="max-w-2xl mx-auto flex flex-col gap-8 h-full justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
          <Shield size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Validador de Senha</h3>
        <p className="text-text-main/50">Teste a segurança da sua senha localmente.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 pr-12 font-mono text-lg bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none"
            placeholder="Digite sua senha..."
          />
          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-text-main/20" size={20} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-text-main/60 uppercase tracking-wider">Força: {getStrengthLabel()}</span>
            <span>{strength}%</span>
          </div>
          <div className="h-3 w-full bg-text-main/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${strength}%` }}
              className={cn("h-full transition-all duration-500", getStrengthColor())}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-bg-main rounded-3xl border border-border-main">
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-text-main/40">Sugestões</h4>
          <div className="space-y-3">
            {feedback.length > 0 ? feedback.map((issue, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-red-600 font-medium">
                <AlertCircle size={16} />
                {issue}
              </div>
            )) : (
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <CheckCircle2 size={16} />
                Sua senha atende a todos os requisitos!
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-text-main text-bg-main rounded-3xl">
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider opacity-40">Dica de Segurança</h4>
          <p className="text-sm leading-relaxed opacity-80">
            Evite usar datas de nascimento, nomes de pets ou sequências óbvias como "123456".
            Uma frase longa com espaços e caracteres especiais é muito mais difícil de quebrar por força bruta.
          </p>
        </div>
      </div>
    </div>
  );
}
