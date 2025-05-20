import 'dotenv/config';
import { Logger } from '@/lib/logger/logger';

import clientPromise from '../lib/db/mongodb';

clientPromise
  .then(() => {
    Logger.success(
      Logger.PREFIXES.DB,
      'MongoDB inicializado com sucesso via init.ts'
    );
  })
  .catch((err) => {
    Logger.error(
      Logger.PREFIXES.DB,
      'Erro ao conectar com o MongoDB via init.ts:',
      err
    );
    process.exit(1);
  });
