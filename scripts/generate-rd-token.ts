import readline from 'readline';

import axios from 'axios';

import 'dotenv/config';
import { Logger } from '../lib/logger/logger';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const { RD_CLIENT_ID, RD_CLIENT_SECRET } = process.env;

if (!RD_CLIENT_ID || !RD_CLIENT_SECRET) {
  Logger.error(
    Logger.PREFIXES.ERROR,
    'RD_CLIENT_ID ou RD_CLIENT_SECRET ausentes no .env'
  );
  process.exit(1);
}

rl.question('Cole o code da URL do RD Station: ', async (code) => {
  try {
    const response = await axios.post('https://api.rd.services/auth/token', {
      client_id: RD_CLIENT_ID,
      client_secret: RD_CLIENT_SECRET,
      code,
      redirect_uri: 'https://api.oraex.com',
      grant_type: 'authorization_code',
    });

    Logger.success(
      Logger.PREFIXES.SUCCESS,
      'access_token:',
      response.data.access_token
    );
    Logger.info(
      Logger.PREFIXES.INFO,
      'refresh_token (salve no .env):',
      response.data.refresh_token
    );
    rl.close();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      Logger.error(
        Logger.PREFIXES.ERROR,
        'Erro ao gerar tokens:',
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      Logger.error(
        Logger.PREFIXES.ERROR,
        'Erro ao gerar tokens:',
        error.message
      );
    } else {
      Logger.error(
        Logger.PREFIXES.ERROR,
        'Erro ao gerar tokens:',
        String(error)
      );
    }
    rl.close();
  }
});
