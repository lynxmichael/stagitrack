import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02, boxShadow: '0 0 30px rgba(59,130,246,0.2)' } : {}}
      className={`bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-glass p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};