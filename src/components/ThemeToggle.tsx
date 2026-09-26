'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a placeholder of the exact same size
    return <div className="w-10 h-10 border-2 border-stone-300 dark:border-stone-700"></div>;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-2 border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-neutral-950 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white hover:bg-stone-100 dark:hover:bg-neutral-900 transition-colors"
      aria-label="Toggle theme"
    >
      <span className={`w-2 h-2 ${isDark ? 'bg-transparent border border-white' : 'bg-neutral-900'}`}></span>
      {isDark ? 'Dark_Sys' : 'Light_Sys'}
    </button>
  );
}

export default ThemeToggle;
