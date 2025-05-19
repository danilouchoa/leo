import { Logger } from '@/lib/logger/logger';

import clientPromise from '../db/mongodb';

export async function saveLead(data: {
  firstname: string;
  surname: string;
  email: string;
  phone: string;
  company: string;
  role: string;
}) {
  try {
    const client = await clientPromise;
    const db = client.db('liveengine');
    const collection = db.collection('leads');

    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    Logger.success(
      Logger.PREFIXES.DB,
      `Lead salvo com ID: ${result.insertedId}`
    );
  } catch (err) {
    Logger.error(Logger.PREFIXES.DB, 'Erro ao salvar lead no MongoDB:', err);
    throw err;
  }
}

export async function saveLeadExtended(data: {
  firstname: string;
  surname: string;
  email: string;
  phone: string;
  company: string;
  roles: string[];
}) {
  try {
    const client = await clientPromise;
    const db = client.db('liveengine');
    const collection = db.collection('leads');

    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    Logger.success(
      Logger.PREFIXES.DB,
      `Lead (com múltiplos cargos) salvo com ID: ${result.insertedId}`
    );
  } catch (err) {
    Logger.error(
      Logger.PREFIXES.DB,
      'Erro ao salvar lead (extended) no MongoDB:',
      err
    );
    throw err;
  }
}
