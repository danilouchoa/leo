'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/register');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center">
        <h1 className="text-xl font-semibold tracking-wide md:text-2xl">
          🥷 Preparando seu acesso ao dojo da inovação...
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Redirecionando para o formulário de inscrição da ORAEX...
        </p>
      </motion.div>
    </main>
  );
}
