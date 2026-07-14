/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Trash2, Link as LinkIcon } from 'lucide-react';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { PasteEditor } from './components/PasteEditor';
import { ExpirationSelector } from './components/ExpirationSelector';
import { GeneratedLink } from './components/GeneratedLink';


export default function App() {
  const [content, setContent] = useState('');
  const [expiration, setExpiration] = useState('24h');
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!content.trim()) return;
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/paste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, expiration }),
      });

      if (!response.ok) throw new Error('Failed to create paste');

      const data = await response.json();
      setShortCode(data.shortCode);
    } catch (error) {
      console.error('Error creating paste:', error);
      alert('Failed to create paste. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setShortCode(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="relative inline-flex items-center justify-center mb-2">
            <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-slate-800 lowercase">
              paste<span className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">.it</span>
            </h1>
            <motion.div
              animate={{ rotate: [0, 14, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute -right-10 -top-4 text-4xl origin-bottom-left select-none"
            >
              ✌️
            </motion.div>
          </div>
          <p className="text-slate-600 text-lg font-medium max-w-md mx-auto leading-relaxed">
            Drop your code, text, or secrets below. Get a beautiful, expiring link in seconds.
          </p>
        </motion.div>

        <Card className="relative overflow-hidden border-2 border-white/60">
          <div className="space-y-6 relative z-10">
            <div>
              <PasteEditor value={content} onChange={(val) => {
                setContent(val);
                if (shortCode) setShortCode(null);
              }} />
              
              <div className="flex items-center justify-between mt-3 px-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {content.length} characters
                </span>
                <AnimatePresence>
                  {content.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleClear}
                      className="text-xs font-semibold text-slate-500 hover:text-pink-500 transition-colors flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                    >
                      <Trash2 size={14} />
                      Clear
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-4 border-t border-slate-200/50">
              <ExpirationSelector value={expiration} onChange={setExpiration} />
              
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!content.trim() || isGenerating}
                className="w-full sm:w-auto shrink-0 shadow-lg shadow-pink-500/20"
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2"
                  >
                    <Loader2 size={20} />
                  </motion.div>
                ) : (
                  <LinkIcon className="mr-2" size={20} />
                )}
                <span className="font-semibold text-base">{isGenerating ? 'Generating...' : 'Generate Link'}</span>
              </Button>
            </div>
          </div>
        </Card>

        <AnimatePresence>
          {shortCode && <GeneratedLink shortCode={shortCode} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
