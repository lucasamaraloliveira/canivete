import React, { useState, useMemo } from 'react';
import { Ruler, RefreshCw, ArrowRightLeft } from 'lucide-react';

const UNITS = {
  comprimento: {
    metros: 1,
    quilômetros: 0.001,
    centímetros: 100,
    milímetros: 1000,
    milhas: 0.000621371,
    pés: 3.28084,
    polegadas: 39.3701
  },
  peso: {
    quilogramas: 1,
    gramas: 1000,
    miligramas: 1000000,
    libras: 2.20462,
    onças: 35.274
  },
  temperatura: {
    celsius: (v: number) => v,
    fahrenheit: (v: number) => (v * 9 / 5) + 32,
    kelvin: (v: number) => v + 273.15
  }
};

export function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof UNITS>('comprimento');
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');

  // Set default units when category changes
  useMemo(() => {
    const units = Object.keys(UNITS[category]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);

  const result = useMemo(() => {
    if (category === 'temperatura') {
      let base = value;
      if (fromUnit === 'fahrenheit') base = (value - 32) * 5 / 9;
      if (fromUnit === 'kelvin') base = value - 273.15;

      if (toUnit === 'celsius') return base;
      if (toUnit === 'fahrenheit') return (base * 9 / 5) + 32;
      if (toUnit === 'kelvin') return base + 273.15;
      return base;
    }

    const units = UNITS[category] as Record<string, number>;
    const baseValue = value / units[fromUnit];
    return baseValue * units[toUnit];
  }, [value, fromUnit, toUnit, category]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 h-full justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
          <Ruler size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Conversor de Unidades</h3>
        <p className="text-text-main/50">Conversão instantânea de medidas offline.</p>
      </div>

      <div className="flex gap-2 p-1 bg-text-main/5 rounded-2xl w-full">
        {Object.keys(UNITS).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat as any)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all capitalize ${category === cat ? "bg-card-main shadow-sm text-text-main" : "text-text-main/50"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-4">
        <div className="flex flex-col gap-3">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full p-4 text-2xl font-bold bg-bg-main border border-border-main rounded-2xl focus:ring-2 focus:ring-text-main/10 outline-none"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full p-3 bg-card-main border border-border-main rounded-xl text-sm font-bold outline-none capitalize text-text-main px-2"
          >
            {Object.keys(UNITS[category]).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="flex justify-center">
          <div className="w-12 h-12 bg-text-main text-bg-main rounded-full flex items-center justify-center shadow-lg">
            <ArrowRightLeft size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="w-full p-4 text-2xl font-bold bg-text-main text-bg-main border border-border-main rounded-2xl">
            {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full p-3 bg-card-main border border-border-main rounded-xl text-sm font-bold outline-none capitalize text-text-main px-2"
          >
            {Object.keys(UNITS[category]).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="p-6 bg-text-main/5 rounded-3xl border border-border-main flex items-center gap-4">
        <div className="w-10 h-10 bg-card-main rounded-xl flex items-center justify-center shadow-sm">
          <RefreshCw size={20} className="text-text-main/40" />
        </div>
        <p className="text-sm font-medium text-text-main/60">
          As conversões são feitas localmente usando fatores de conversão padrão da indústria.
        </p>
      </div>
    </div>
  );
}
