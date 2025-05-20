import { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRightLong } from 'react-icons/fa6';

import { Input } from '@/components/ui/input';
import { EnhancedButton } from '@/components/ui/enhanced-btn';
import { containerVariants, itemVariants } from '@/lib/animation-variants';

const INTERESSES_PADROES = [
  'Alta Disponibilidade',
  'Automação de Infraestrutura',
  'Backup e DR',
  'Banco de Dados em Cloud',
  'Casos de Sucesso de Nossos Clientes',
  'AWS',
  'Azure',
  'Google',
  'Oracle',
  'Migração para Cloud',
  'Custos e FinOps',
  'DevSecOps',
  'Kubernetes',
  'Monitoramento e Logs',
  'Observabilidade',
  'Segurança da Informação',
  'Tendências em Arquitetura Cloud',
  'IaC (Infrastructure as Code)',
  'Outro',
];

const CARGOS_LISTA = [
  'C-Level',
  'Diretor',
  'Gerente',
  'Coordenador',
  'Tech leader',
  'Analista',
  'Estagiário',
];

interface FormProps {
  name: string;
  surname: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  roles: string[];
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSurnameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCompanyChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleJobTitleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleRoleChange: (role: string) => void;
  handleSubmit: () => void;
  loading: boolean;
}

export default function Form({
  name,
  surname,
  email,
  phone,
  company,
  jobTitle,
  roles,
  handleNameChange,
  handleSurnameChange,
  handleEmailChange,
  handlePhoneChange,
  handleCompanyChange,
  handleJobTitleChange,
  handleRoleChange,
  handleSubmit,
  loading,
}: FormProps) {
  return (
    <motion.div
      className="mt-6 flex w-full max-w-[24rem] flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.div variants={itemVariants}>
        <Input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={handleNameChange}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input
          type="text"
          placeholder="Sobrenome"
          value={surname}
          onChange={handleSurnameChange}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={handleEmailChange}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input
          type="tel"
          placeholder="Telefone"
          value={phone}
          onChange={handlePhoneChange}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input
          type="text"
          placeholder="Empresa"
          value={company}
          onChange={handleCompanyChange}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <label className="mb-1 block text-white" htmlFor="job-title-select">
          Cargo:
        </label>
        <select
          id="job-title-select"
          className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-white"
          value={jobTitle}
          onChange={handleJobTitleChange}>
          {CARGOS_LISTA.map((cargo) => (
            <option key={cargo} value={cargo}>
              {cargo}
            </option>
          ))}
        </select>
      </motion.div>
      <motion.div variants={itemVariants}>
        <label className="mb-1 block text-cyan-50" htmlFor="interesse-0">
          Selecione seu(s) interesse(s):
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESSES_PADROES.map((interesse, idx) => (
            <label
              key={interesse}
              className="flex items-center gap-1"
              htmlFor={`interesse-${idx}`}>
              <input
                id={`interesse-${idx}`}
                type="checkbox"
                value={interesse}
                checked={roles.includes(interesse)}
                onChange={() => handleRoleChange(interesse)}
                className="accent-sky-600"
              />
              <span>{interesse}</span>
            </label>
          ))}
        </div>
      </motion.div>
      <motion.div variants={itemVariants}>
        <EnhancedButton
          variant="expandIcon"
          Icon={FaArrowRightLong}
          onClick={handleSubmit}
          iconPlacement="right"
          className="mt-2 w-full"
          disabled={loading}>
          {loading ? 'Carregando..' : 'Se Inscrever para Receber Novidades!'}
        </EnhancedButton>
      </motion.div>
    </motion.div>
  );
}
