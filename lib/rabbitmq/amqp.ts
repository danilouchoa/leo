import 'dotenv/config';

import * as amqp from 'amqplib';

import { Logger } from '@/lib/logger/logger';

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

async function retryConnect(attempt = 1): Promise<unknown> {
  if (!process.env.RABBITMQ_URL) {
    throw new Error(
      `${Logger.PREFIXES.QUEUE} ❌ RABBITMQ_URL não está definida no .env`
    );
  }

  try {
    return await amqp.connect(process.env.RABBITMQ_URL!);
  } catch (err) {
    if (attempt >= MAX_RETRIES) {
      Logger.error(
        Logger.PREFIXES.QUEUE,
        `❌ Falha ao conectar ao RabbitMQ após ${MAX_RETRIES} tentativas.`
      );
      throw err;
    }

    const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
    Logger.warn(
      Logger.PREFIXES.QUEUE,
      `⚠️ Tentativa ${attempt} falhou. Repetindo em ${delay / 1000}s...`
    );
    await new Promise((res) => setTimeout(res, delay));
    return retryConnect(attempt + 1);
  }
}

export async function getAmqpChannel(): Promise<amqp.Channel> {
  if (channel && connection) return channel;

  try {
    const rawConn = await retryConnect();

    const conn = rawConn as unknown as {
      createChannel: () => Promise<amqp.Channel>;
    };
    const ch = await conn.createChannel();

    connection = rawConn as amqp.Connection;
    channel = ch;

    Logger.success(
      Logger.PREFIXES.QUEUE,
      'Conexão AMQP estabelecida com sucesso'
    );
    return ch;
  } catch (err) {
    Logger.error(Logger.PREFIXES.QUEUE, 'Erro ao conectar no AMQP:', err);
    throw err;
  }
}
