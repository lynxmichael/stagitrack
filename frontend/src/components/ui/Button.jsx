import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-neon',
    secondary: 'bg-white/30 dark:bg-slate-700/50 backdrop-blur-sm border border-white/30 dark:border-slate-600 text-slate-800 dark:text-white hover:bg-white/50 dark:hover:bg-slate-600/70',
    danger: 'bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-600',
    ghost: 'bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
