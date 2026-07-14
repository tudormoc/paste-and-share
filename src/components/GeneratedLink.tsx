import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface GeneratedLinkProps {
  shortCode: string;
}

export function GeneratedLink({ shortCode }: GeneratedLinkProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  // We use a dummy domain for display to make it look cool, or window.location
  const displayUrl = `share.it/p/${shortCode}`;
  const fullUrl = `${window.location.origin}/p/${shortCode}`;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20 }}
      className="mt-6 overflow-hidden"
    >
      <div className="p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full flex items-center bg-white/50 rounded-xl px-4 py-3 border border-white/40 overflow-hidden">
          <span className="font-mono text-slate-700 font-medium truncate select-all">{displayUrl}</span>
        </div>
        
        <div className="flex w-full sm:w-auto gap-2">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none min-w-[120px] bg-white/80"
            onClick={() => copyToClipboard(fullUrl)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isCopied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center justify-center gap-2 text-emerald-600 w-full"
                >
                  <Check size={18} />
                  <span>Copied! 🎉</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <Copy size={18} />
                  <span>Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          
          <Button variant="primary" size="icon" className="shrink-0" title="Open Link">
             <ExternalLink size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
