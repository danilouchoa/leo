import { motion } from 'framer-motion';

import { containerVariants } from '@/lib/animation-variants';

export default function Footer() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-background text-muted-foreground mt-auto flex w-full items-center justify-center gap-1 border-t p-6 md:justify-start"></motion.div>
  );
}
