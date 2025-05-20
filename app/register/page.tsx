'use client';

import { toast } from 'sonner';
import { useState } from 'react';

import CTA from '@/components/cta';
import Form from '@/components/forms/form';
import Logos from '@/components/logos';
import Particles from '@/components/ui/particles';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Home() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('C-Level');
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSurname(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPhone(e.target.value);
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCompany(e.target.value);
  const handleJobTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setJobTitle(e.target.value);
  const handleRoleChange = (cargo: string) => {
    setRoles((prev) =>
      prev.includes(cargo) ? prev.filter((r) => r !== cargo) : [...prev, cargo]
    );
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !surname ||
      !email ||
      !phone ||
      !company ||
      !jobTitle ||
      roles.length === 0
    ) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error(
        'O e-mail informado não é válido. Verifique e tente novamente.'
      );
      return;
    }

    setLoading(true);

    const promise = new Promise((resolve, reject) => {
      (async () => {
        try {
          const mailResponse = await fetch('/api/pre-register', {
            cache: 'no-store',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstname: name,
              surname,
              email,
              phone,
              company,
              job_title: jobTitle,
              interests: roles,
            }),
          });

          if (!mailResponse.ok) {
            if (mailResponse.status === 429) {
              reject('Rate limited');
            } else {
              reject('Email sending failed');
            }
            return;
          }

          resolve({ name });
        } catch (error) {
          reject(error);
        }
      })();
    });

    toast.promise(promise, {
      loading: 'Estamos enviando suas informações...',
      success: () => {
        setName('');
        setSurname('');
        setEmail('');
        setPhone('');
        setCompany('');
        setJobTitle('');
        setRoles([]);
        return 'Obrigado por se inscrever! Em breve você receberá novidades sobre o evento.';
      },
      error: (error) => {
        if (error === 'Rate limited')
          return 'Você realizou muitas tentativas. Por favor, aguarde um momento e tente novamente.';
        if (error === 'Email sending failed')
          return 'Não foi possível enviar seu e-mail. Tente novamente em instantes.';
        return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-12 md:pt-24">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <Header />
        <CTA />
        <Form
          name={name}
          surname={surname}
          email={email}
          phone={phone}
          company={company}
          jobTitle={jobTitle}
          roles={roles}
          handleNameChange={handleNameChange}
          handleSurnameChange={handleSurnameChange}
          handleEmailChange={handleEmailChange}
          handlePhoneChange={handlePhoneChange}
          handleCompanyChange={handleCompanyChange}
          handleJobTitleChange={handleJobTitleChange}
          handleRoleChange={handleRoleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        <Logos />
      </section>
      <Footer />
      <Particles
        quantityDesktop={350}
        quantityMobile={100}
        ease={80}
        color={'##00B2FF'}
        refresh
      />
    </main>
  );
}
