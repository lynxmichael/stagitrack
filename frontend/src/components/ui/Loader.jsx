import { motion } from 'framer-motion';

export const Loader = ({ text = 'Chargement...' }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16">
    <motion.div
      animate={{ rotate:360 }}
      transition={{ duration:1, repeat:Infinity, ease:'linear' }}
      className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600"
    />
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{text}</p>
  </div>
);

export const Skeleton = ({ className = '' }) => (
  <div className={`bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse ${className}`} />
);
