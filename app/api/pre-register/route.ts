import { NextRequest, NextResponse } from 'next/server';

import clientPromise from '@/lib/db/mongodb';
import { Logger } from '@/lib/logger/logger';
import { publishToQueue } from '@/lib/rabbitmq/queue';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('leads').insertOne(body);

    Logger.success(
      Logger.PREFIXES.DB,
      `Novo lead salvo no MongoDB com ID: ${result.insertedId}`
    );

    // Publica nas filas
    await publishToQueue('rd_station_pre_register_queue', body);
    await publishToQueue('email_pre_register_queue', {
      email: body.email,
      firstname: body.firstname || body.nome || '',
      surname: body.surname || '',
      phone: body.phone || '',
      company: body.company || '',
      jobTitle: body.job_title || body.cargo || '',
      interests: Array.isArray(body.interests) ? body.interests : [],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    Logger.error(Logger.PREFIXES.API, 'Erro ao cadastrar lead:', err);
    return NextResponse.json(
      { error: 'Erro ao cadastrar lead' },
      { status: 500 }
    );
  }
}
