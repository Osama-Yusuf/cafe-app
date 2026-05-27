import { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { fmt } from '@/lib/format';

interface EditableNumberProps {
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EditableNumber({ value, onChange, suffix, className = '', size = 'md' }: EditableNumberProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) setDraft(String(value));
  }, [value, editing]);

  const commit = () => {
    setEditing(false);
    const n = Number(draft) || 0;
    if (n !== value) onChange(n);
  };

  const sizeClasses = {
    sm: 'text-xs h-7 px-2',
    md: 'text-sm h-8 px-3',
    lg: 'text-base h-9 px-3',
  }[size];

  const displayClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(String(value)); setEditing(false); } }}
        className={`bg-[#131313] border border-[#d4a54a]/40 rounded-lg text-[#ece5db] font-semibold tabular-nums text-right outline-none focus:border-[#d4a54a] focus:shadow-[0_0_0_2px_rgba(212,165,74,0.15)] ${sizeClasses} ${className}`}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`group inline-flex items-center gap-1.5 tabular-nums font-semibold text-[#d4a54a] hover:text-[#ece5db] transition-colors cursor-text rounded-lg px-2 py-0.5 -mx-2 border border-dashed border-[#333]/60 hover:bg-[#1e1e1e] hover:border-[#d4a54a]/30 ${displayClasses} ${className}`}
    >
      {fmt(value)}{suffix && <span className="text-[#6b6158] font-normal">{suffix}</span>}
      <Pencil size={size === 'sm' ? 10 : 12} className="text-[#6b6158] shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" />
    </button>
  );
}
