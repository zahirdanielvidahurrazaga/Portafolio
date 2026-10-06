import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { useLang } from '../lib/LangContext';
import '../styles/ThemeToggle.css';

/**
 * Botón sol/luna. Va en la navbar (visible también en móvil, junto al menú:
 * es lo primero que la gente quiere probar y no debería estar escondido).
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const esOscuro = theme === 'dark';
  const { t } = useLang();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        esOscuro
          ? t({ es: 'Cambiar a modo claro', en: 'Switch to light mode' })
          : t({ es: 'Cambiar a modo oscuro', en: 'Switch to dark mode' })
      }
      title={esOscuro ? t({ es: 'Modo claro', en: 'Light mode' }) : t({ es: 'Modo oscuro', en: 'Dark mode' })}
    >
      {/* mode="wait" evita que el sol y la luna se encimen durante el cruce */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="theme-toggle-icon"
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {esOscuro ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
