/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Home, Copy, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

interface PasteData {
  content: string;
  createdAt: number;
  expiresAt: number;
}

export default function ViewPaste() {
  const { code } = useParams<{ code: string }>();
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const response = await fetch(`/api/paste?code=${code}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Paste not found or expired');
          } else {
            setError('Failed to load paste');
          }
          return;
        }

        const data = await response.json();
        setPaste(data);
      } catch (err) {
        setError('Failed to load paste');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchPaste();
    }
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 size={48} className="text-purple-500" />
        </motion.div>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-12">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {error || 'Paste not found'}
          </h2>
          <p className="text-slate-600 mb-6">
            This paste may have expired or never existed.
          </p>
          <Link to="/">
            <Button>
              <Home size={20} className="mr-2" />
              Create New Paste
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const expiresIn = Math.max(0, paste.expiresAt - Date.now());
  const expiresInHours = Math.floor(expiresIn / (1000 * 60 * 60));
  const expiresInMinutes = Math.floor((expiresIn % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <h1 className="text-4xl font-black text-slate-800">
            paste<span className="text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">.it</span>
          </h1>
          <Link to="/">
            <Button variant="outline" size="sm">
              <Home size={18} className="mr-2" />
              New Paste
            </Button>
          </Link>
        </motion.div>

        <Card className="border-2 border-white/60">
          <div className="mb-4 pb-4 border-b border-slate-200/50 flex items-center justify-between">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Created {new Date(paste.createdAt).toLocaleString()}</span>
              <span className="ml-4 font-semibold text-pink-600">
                Expires in {expiresInHours}h {expiresInMinutes}m
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(paste.content)}
              className="ml-4"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isCopied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-2 text-emerald-600"
                  >
                    <Check size={18} />
                    <span>Copied!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <Copy size={18} />
                    <span>Copy</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          
          <Editor
            value={paste.content}
            onValueChange={() => {}}
            highlight={(code) => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
            padding={16}
            readOnly
            className="font-mono text-sm bg-slate-900 rounded-lg"
            style={{
              fontFamily: '"Fira Code", "Consolas", monospace',
              minHeight: '300px',
            }}
          />
        </Card>
      </div>
    </div>
  );
}
