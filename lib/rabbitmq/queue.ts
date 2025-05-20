import type { ConsumeMessage } from 'amqplib';

import { Logger } from '@/lib/logger/logger';
import { getAmqpChannel } from '@/lib/rabbitmq/amqp';

// Use genérico T para tipar a mensagem
export async function publishToQueue<T = unknown>(queue: string, message: T) {
  const ch = await getAmqpChannel();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  Logger.info(Logger.PREFIXES.QUEUE, `📤 Mensagem publicada na fila ${queue}`);
}

export async function subscribeToQueue<T = unknown>(
  queue: string,
  handler: (data: T) => Promise<void>
) {
  const ch = await getAmqpChannel();
  await ch.assertQueue(queue, { durable: true });

  Logger.info(Logger.PREFIXES.QUEUE, `📡 Subscrito à fila: ${queue}`);

  ch.consume(queue, async (msg: ConsumeMessage | null) => {
    if (msg) {
      try {
        const data: T = JSON.parse(msg.content.toString());
        await handler(data);
        ch.ack(msg);
      } catch (err) {
        Logger.error(
          Logger.PREFIXES.QUEUE,
          `❌ Erro ao processar mensagem da fila ${queue}:`,
          err
        );
        ch.nack(msg, false, true);
      }
    }
  });
}
