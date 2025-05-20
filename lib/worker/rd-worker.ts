import { subscribeToQueue } from '@/lib/rabbitmq/queue';

import { sendToRDStation } from '../rdstation/rd';
import { Logger } from '../logger/logger';

const queueName = 'rd_station_pre_register_queue';

interface RdPayload {
  firstname: string;
  surname: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  interests?: string[];
}

subscribeToQueue<RdPayload>(queueName, async (payload) => {
  try {
    await sendToRDStation({
      firstname: payload.firstname,
      surname: payload.surname,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      job_title: payload.job_title,
      interests: payload.interests || [],
    });
  } catch (error) {
    Logger.error(
      Logger.PREFIXES.RD,
      `📦 [QUEUE] ❌ Erro ao processar lead da fila ${queueName}:`,
      error
    );
    throw error;
  }
});
