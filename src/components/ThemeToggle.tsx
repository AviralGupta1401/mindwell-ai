'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  if (!theme) {
    return (
      <button
        className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)]"
        aria-label="Toggle theme"
      >
        <Moon className="w-5 h-5 text-[var(--muted-dark)]" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] hover:opacity-80 transition duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-[#e94560]" />
      )}
    </button>
  );
}
