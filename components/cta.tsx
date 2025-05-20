import { motion } from 'framer-motion';

import TextBlur from '@/components/ui/text-blur';
import AnimatedShinyText from '@/components/ui/shimmer-text';
import { containerVariants, itemVariants } from '@/lib/animation-variants';

export default function CTA() {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      {/* Badge com Montserrat */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="bg-muted/80 flex w-fit animate-pulse items-center justify-center rounded-full px-4 py-2 text-center font-[var(--font-montserrat)] ring-1 ring-primary/40 backdrop-blur-md">
            <AnimatedShinyText>SAVE THE DATE</AnimatedShinyText>
          </div>
        </div>
      </motion.div>

      {/* Logo com animação suave */}
      <motion.img
        src="/oraex.svg"
        alt="logo"
        className="mx-auto h-24 w-24"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        variants={itemVariants}
      />

      {/* Título principal com Montserrat */}
      <motion.div variants={itemVariants}>
        <TextBlur
          className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-center text-4xl font-[var(--font-montserrat)] tracking-tight text-transparent sm:text-6xl"
          text="CONVITE_CENTRAL"
        />
      </motion.div>

      {/* Descrição com Inter para boa leitura */}
      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-[27rem] pt-1.5 text-center text-base font-[var(--font-inter)] text-sky-200 sm:text-lg"
          text="DESCRICAO_DO_EVENTO"
          duration={2}
        />
      </motion.div>
    </motion.div>
  );
}
