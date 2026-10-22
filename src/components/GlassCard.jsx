import { motion } from 'framer-motion';
export default function GlassCard({ children, className = '', ...p }) {
  return <motion.div className={`glass-card ${className}`} {...p}>{children}</motion.div>;
}
