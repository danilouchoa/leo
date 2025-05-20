import { MongoClient } from 'mongodb';

import { Logger } from '@/lib/logger/logger';

if (!process.env.MONGODB_URI) {
  throw new Error('❌ MONGODB_URI não está definida no .env.local');
}

const uri = process.env.MONGODB_URI;
const options: ConstructorParameters<typeof MongoClient>[1] = {};

let client: MongoClient;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function logConnection(env: string) {
  const dbHost = new URL(uri).host;
  Logger.info(
    Logger.PREFIXES.DB,
    `Conectando ao MongoDB (${env}) em ${dbHost}...`
  );
}

// Sempre usa cache global, inclusive em produção/serverless
if (!global._mongoClientPromise) {
  logConnection('global (cache)');
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect().then((c) => {
    Logger.info(Logger.PREFIXES.DB, '✅ Conectado ao MongoDB (global)');
    return c;
  });
}
const clientPromise = global._mongoClientPromise!; // Agora inicializado corretamente

// Força execução para garantir exibição dos logs
clientPromise.catch((err) => {
  Logger.error(Logger.PREFIXES.DB, '❌ Erro ao conectar no MongoDB:', err);
});

export default clientPromise;
