import { motion } from 'framer-motion';

import { containerVariants } from '@/lib/animation-variants';

export default function Header() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed left-0 right-0 top-0 z-[50] m-4 flex justify-between"></motion.div>
  );
}
