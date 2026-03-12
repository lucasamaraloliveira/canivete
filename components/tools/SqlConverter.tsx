"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Database, Copy, Check, Sparkles, ArrowRightLeft, FileJson, Code2, Layers, Zap } from 'lucide-react';
import { format } from 'sql-formatter';
import { CodeBlock } from '../CodeBlock';
import { cn } from '@/lib/utils';

type Dialect = 'mysql' | 'postgresql' | 'mongodb' | 'sqlite';

export function SqlConverter() {
  const [input, setInput] = useState("-- SQL Server Input\nSELECT TOP 10 \n    id, \n    name, \n    GETDATE() as created_at \nFROM users \nWHERE status = 'active' \nORDER BY name ASC;");
  const [output, setOutput] = useState('');
  const [targetDialect, setTargetDialect] = useState<Dialect>('mysql');
  const [beautify, setBeautify] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const convertSQL = useCallback(() => {
    setIsProcessing(true);
    let result = input;

    // Dialect Conversion Logic (SQL Server as Base)
    if (targetDialect !== 'mongodb') {
      // Common SQL Server to Standard/Other
      
      // 1. TOP N -> LIMIT N (Post-process later for position)
      const topMatch = result.match(/SELECT\s+TOP\s+(\d+)/i);
      if (topMatch) {
        result = result.replace(/SELECT\s+TOP\s+(\d+)/i, 'SELECT');
        const limitVal = topMatch[1];
        if (!result.toLowerCase().includes('limit')) {
            result = result.trim().replace(/;?$/, ` LIMIT ${limitVal};`);
        }
      }

      // 2. GETDATE() -> NOW()
      result = result.replace(/GETDATE\(\)/gi, targetDialect === 'mysql' ? 'NOW()' : 'CURRENT_TIMESTAMP');

      // 3. ISNULL -> COALESCE or IFNULL
      if (targetDialect === 'mysql') {
        result = result.replace(/ISNULL\(/gi, 'IFNULL(');
      } else {
        result = result.replace(/ISNULL\(/gi, 'COALESCE(');
      }

      // 4. Square brackets [] -> Quotes
      if (targetDialect === 'mysql') {
        result = result.replace(/\[([^\]]+)\]/g, '`$1`');
      } else {
        result = result.replace(/\[([^\]]+)\]/g, '"$1"');
      }

      // 5. Identity -> Auto Increment
      if (targetDialect === 'mysql') {
        result = result.replace(/IDENTITY\s*\(\d+,\d+\)/gi, 'AUTO_INCREMENT');
      } else if (targetDialect === 'postgresql') {
        result = result.replace(/INT\s+IDENTITY\s*\(\d+,\d+\)/gi, 'SERIAL');
      }

      // 6. Types
      result = result.replace(/NVARCHAR\((max|\d+)\)/gi, 'VARCHAR($1)');
      result = result.replace(/NCHAR\(\d+\)/gi, 'CHAR');
      result = result.replace(/DATETIME2?/gi, 'TIMESTAMP');

      // 7. BIT -> BOOLEAN/TINYINT
      if (targetDialect === 'sqlite') {
          result = result.replace(/\bBIT\b/gi, 'INTEGER');
      } else {
          result = result.replace(/\bBIT\b/gi, 'BOOLEAN');
      }
    } else {
      // SQL to Mongo-ish JSON (Heuristic)
      try {
        const tableNameMatch = input.match(/FROM\s+(\w+)/i);
        const tableName = tableNameMatch ? tableNameMatch[1] : 'collection';
        
        const selectFields = input.match(/SELECT\s+(.*?)\s+FROM/is);
        const fields = selectFields ? selectFields[1].split(',').map(f => f.trim()) : ['*'];

        const mongoDoc: any = {
            collection: tableName,
            operation: 'find',
            filter: {},
            projection: {}
        };

        if (fields[0] !== '*') {
            fields.forEach(f => {
                const clean = f.split(' ').pop() || f;
                mongoDoc.projection[clean] = 1;
            });
        }

        result = `// MongoDB Equivalent (Heuristic)\ndb.${tableName}.find(\n  { /* filters */ }, \n  ${JSON.stringify(mongoDoc.projection, null, 2)}\n)`;
      } catch (e) {
        result = "// Erro ao converter para NoSQL. Tente um SQL simples.";
      }
    }

    // Beautify
    if (beautify && targetDialect !== 'mongodb') {
      try {
        result = format(result, {
          language: targetDialect === 'sqlite' ? 'sql' : targetDialect as any,
          keywordCase: 'upper',
          indentStyle: 'tabularLeft',
        });
      } catch (e) {
        // Fallback if formatter fails
      }
    }

    setOutput(result);
    setTimeout(() => setIsProcessing(false), 300);
  }, [input, targetDialect, beautify]);

  useEffect(() => {
    const timer = setTimeout(convertSQL, 500);
    return () => clearTimeout(timer);
  }, [convertSQL]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 flex-1 min-h-0">
        {/* Input Panel */}
        <div className="flex flex-col gap-3 lg:gap-4 flex-1 min-w-0">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main/40 flex items-center gap-2">
              <Database size={14} /> SQL Server Input
            </label>
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setInput('')}
                className="text-[10px] font-bold text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-widest"
               >
                 Limpar
               </button>
            </div>
          </div>
          <div className="relative group flex-1 min-h-[200px] lg:min-h-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full p-4 lg:p-6 font-mono text-sm bg-card-main border border-border-main rounded-[24px] lg:rounded-[32px] focus:ring-4 focus:ring-text-main/5 outline-none resize-none transition-all custom-scrollbar group-hover:border-text-main/20 shadow-inner"
              placeholder="Digite seu SQL do SQL Server aqui..."
            />
            {isProcessing && (
              <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
                <Zap size={16} className="text-yellow-500 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Action Gap / Arrows */}
        <div className="hidden xl:flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 bg-text-main/5 rounded-xl flex items-center justify-center text-text-main/20">
                <ArrowRightLeft size={20} />
            </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col gap-3 lg:gap-4 flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex bg-text-main/5 p-1 rounded-xl lg:rounded-2xl border border-border-main">
              {(['mysql', 'postgresql', 'sqlite', 'mongodb'] as Dialect[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setTargetDialect(d)}
                  className={cn(
                    "px-3 lg:px-4 py-1.5 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all",
                    targetDialect === d 
                      ? "bg-text-main text-bg-main shadow-lg" 
                      : "text-text-main/40 hover:text-text-main hover:bg-text-main/5"
                  )}
                >
                  {d === 'mongodb' ? 'No-SQL' : d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setBeautify(!beautify)}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all border",
                        beautify ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-text-main/5 text-text-main/40 border-transparent"
                    )}
                >
                    <Sparkles size={10} /> Format
                </button>
                <button
                    onClick={copyToClipboard}
                    className={cn(
                        "flex items-center gap-1.5 px-3 lg:px-4 py-1.5 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95",
                        copied ? "bg-green-500 text-white" : "bg-text-main text-bg-main hover:opacity-90"
                    )}
                >
                    {copied ? <Check size={10} /> : <Copy size={10} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
          </div>

          <div className="flex-1 relative min-h-[200px] lg:min-h-0 group">
            <div className="absolute inset-0 bg-[#0D0D0D] rounded-[24px] lg:rounded-[32px] overflow-hidden border border-border-main group-hover:border-text-main/20 shadow-2xl transition-all">
                <div className="h-full overflow-auto custom-scrollbar">
                    <CodeBlock
                        code={output || '-- Convertendo...'}
                        language={targetDialect === 'mongodb' ? 'javascript' : 'sql'}
                    />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-text-main/5 p-4 lg:p-6 border border-border-main flex flex-col sm:flex-row items-center gap-3 lg:gap-4 text-center sm:text-left shrink-0 rounded-[20px] lg:rounded-[32px]">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/10 text-blue-500 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0">
           <Zap size={20} className="lg:w-6 lg:h-6" />
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-xs lg:text-sm mb-0.5 lg:mb-1">Dica de Conversão</h4>
            <p className="text-[9px] lg:text-[10px] opacity-60 leading-relaxed font-medium">
                Esta ferramenta realiza uma tradução heurística de sintaxe (como <code className="text-text-main">TOP</code> para <code className="text-text-main">LIMIT</code>). 
                Para procedimentos complexos ou triggers, revise o código gerado. O modo No-SQL gera projeções JSON baseadas na estrutura SQL.
            </p>
        </div>
      </div>
    </div>
  );
}
