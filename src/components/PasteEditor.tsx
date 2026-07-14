import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';

interface PasteEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function PasteEditor({ value, onChange }: PasteEditorProps) {
  const highlight = (code: string) => {
    let lang = Prism.languages.tsx;
    if (code.trim().startsWith('{') || code.trim().startsWith('[')) lang = Prism.languages.json;
    else if (code.includes('<div') || code.includes('</')) lang = Prism.languages.tsx;
    
    return Prism.highlight(code, lang, 'tsx');
  };

  return (
    <div className="editor-container relative w-full flex flex-col bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-transparent transition-all group">
      {/* Mac OS Header style */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/30 border-b border-white/40 backdrop-blur-sm">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="font-mono text-[10px] sm:text-xs text-slate-500/70 uppercase tracking-widest font-bold flex-1 text-center pr-10 select-none">
          untitled.txt
        </div>
      </div>
      
      <div className="flex-1 overflow-auto h-[260px] sm:h-[360px]">
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={highlight}
          padding={24}
          className="min-h-full font-mono text-sm sm:text-base outline-none text-slate-700"
          textareaClassName="outline-none focus:outline-none"
          placeholder="Start typing or paste something... 🚀"
          style={{
            fontFamily: 'var(--font-mono)',
          }}
        />
      </div>
    </div>
  );
}
