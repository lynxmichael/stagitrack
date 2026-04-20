import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center page-bg">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-center">
        <motion.p animate={{y:[0,-10,0]}} transition={{duration:3,repeat:Infinity}} className="text-8xl font-black text-primary-600 mb-4">404</motion.p>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Page introuvable</h1>
        <p className="text-slate-500 mb-6">La page que vous cherchez n'existe pas.</p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold shadow-neon hover:opacity-90 transition">
          Retour au tableau de bord
        </Link>
      </motion.div>
    </div>
  );
}
