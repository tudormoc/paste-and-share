import { motion } from 'motion/react';
import { cn } from '../utils/cn';

const EXPIRATIONS = [
  { label: '5m', value: '5m' },
  { label: '10m', value: '10m' },
  { label: '1h', value: '1h' },
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: 'Never ♾️', value: 'never' },
];

interface ExpirationSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function ExpirationSelector({ value, onChange }: ExpirationSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-600 ml-1">Expires in ⏱️</label>
      <div className="flex flex-wrap gap-2">
        {EXPIRATIONS.map((exp) => {
          const isSelected = value === exp.value;
          return (
            <button
              key={exp.value}
              onClick={() => onChange(exp.value)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-pink-500 cursor-pointer border',
                isSelected ? 'text-white border-transparent' : 'text-slate-600 bg-white/40 hover:bg-white/60 border-white/40 hover:border-white/60 shadow-sm'
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-expiration"
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl shadow-md"
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{exp.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
