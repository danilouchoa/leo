import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { containerVariants, itemVariants } from '@/lib/animation-variants';

import TextBlur from './ui/text-blur';

const logos = [
  { href: 'https://www.oraex.com', src: '/oraex.svg', alt: 'Oraex Logo' },
];

export default function Logos() {
  return (
    <motion.div
      className="flex h-full w-full flex-col gap-2 pb-12 pt-12 md:pb-24 md:pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-2xl font-medium tracking-tight text-zinc-200 md:text-3xl"
          text="Powered by"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-base text-zinc-300 sm:text-lg"
          text="ORAEX Cloud Consulting"
          duration={0.8}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-4 flex w-full items-center justify-center md:mt-6">
        {logos.map((logo, index) => (
          <Link
            key={index}
            href={logo.href}
            rel="noopener noreferrer"
            target="_blank"
            className="flex h-24 items-center justify-center bg-transparent">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={100}
              height={100}
              className="h-auto w-32 opacity-85"
            />
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}
