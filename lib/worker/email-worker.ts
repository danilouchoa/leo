import 'dotenv/config';

import { Logger } from '@/lib/logger/logger';
import { sendEmail } from '@/lib/email';

import { subscribeToQueue } from '../rabbitmq/queue';

const QUEUE_NAME = 'email_pre_register_queue';

interface EmailPayload {
  firstname: string;
  surname: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  interests?: string[];
}

function isValidEmail(email?: string) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

subscribeToQueue<EmailPayload>(QUEUE_NAME, async (payload) => {
  try {
    const email = typeof payload.email === 'string' ? payload.email.trim() : '';
    Logger.info(
      Logger.PREFIXES.EMAIL,
      'Validando e-mail:',
      email,
      JSON.stringify(email)
    );

    if (!isValidEmail(email)) {
      Logger.error(
        Logger.PREFIXES.EMAIL,
        `Payload inválido: e-mail ausente ou mal formatado`,
        payload
      );
      return;
    }

    await sendEmail({ ...payload, email });
    Logger.success(
      Logger.PREFIXES.EMAIL,
      `E-mail enviado com sucesso para: ${email}`
    );
  } catch (error) {
    Logger.error(Logger.PREFIXES.EMAIL, `Erro ao enviar e-mail`, error);
    throw new Error('Erro ao enviar e-mail via SES');
  }
});
