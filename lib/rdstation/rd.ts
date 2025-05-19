import axios from 'axios';

import { Logger } from '@/lib/logger/logger';

const { RD_CLIENT_ID, RD_CLIENT_SECRET, RD_REFRESH_TOKEN } = process.env;

let rdAccessToken: string | null = null;
let rdTokenExpiry: number | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (!RD_CLIENT_ID || !RD_CLIENT_SECRET || !RD_REFRESH_TOKEN) {
    Logger.error(
      Logger.PREFIXES.RD,
      '❌ Variáveis de ambiente RD incompletas.'
    );
    return null;
  }

  try {
    Logger.info(Logger.PREFIXES.RD, '🔁 Solicitando novo access_token...');
    const response = await axios.post(
      'https://api.rd.services/auth/token?token_by=refresh_token',
      {
        client_id: RD_CLIENT_ID,
        client_secret: RD_CLIENT_SECRET,
        refresh_token: RD_REFRESH_TOKEN,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const { access_token, expires_in } = response.data;
    rdAccessToken = access_token;
    rdTokenExpiry = Date.now() + (expires_in - 60) * 1000;

    const h = Math.floor(expires_in / 3600);
    const m = Math.floor((expires_in % 3600) / 60);
    const s = expires_in % 60;

    Logger.success(
      Logger.PREFIXES.RD,
      '🔑 Novo access_token obtido com sucesso.'
    );
    Logger.info(
      Logger.PREFIXES.RD,
      `⏳ Validade do token: ${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    );
    return rdAccessToken;
  } catch (error: unknown) {
    let msg = '';
    if (typeof error === 'object' && error !== null) {
      // Se for erro Axios
      if (
        'response' in error &&
        typeof (error as Record<string, unknown>).response === 'object'
      ) {
        const responseData = (
          error as { response?: { data?: unknown }; message?: string }
        ).response?.data;
        msg =
          typeof responseData === 'string'
            ? responseData
            : responseData !== undefined
              ? JSON.stringify(responseData)
              : (error as { message?: string }).message || String(error);
      } else if ('message' in error) {
        msg = (error as { message?: string }).message || String(error);
      } else {
        msg = String(error);
      }
    } else {
      msg = String(error);
    }
    Logger.error(Logger.PREFIXES.RD, '❌ Erro ao renovar access_token:', msg);
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const isValid = rdAccessToken && rdTokenExpiry && Date.now() < rdTokenExpiry;
  if (isValid) {
    Logger.info(
      Logger.PREFIXES.RD,
      `🔁 Reutilizando access_token válido (expira em ${Math.floor((rdTokenExpiry! - Date.now()) / 1000)}s)`
    );
    return rdAccessToken;
  }

  return await refreshAccessToken();
}

export async function sendToRDStation(lead: {
  firstname: string;
  surname: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  interests?: string[];
}) {
  const { firstname, surname, email, phone, company, job_title, interests } =
    lead;
  const token = await getAccessToken();
  if (!token) throw new Error('Não foi possível obter access token.');

  Logger.debug(Logger.PREFIXES.RD, '📦 Payload recebido do lead:', lead);
  Logger.info(
    Logger.PREFIXES.RD,
    '📤 Enviando dados do lead para RD Station...'
  );

  const interesses = Array.isArray(interests)
    ? interests.map((tag) =>
        tag
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/\s+/g, '_')
      )
    : [];

  interface BasePayload {
    name: string;
    email: string;
    personal_phone?: string;
    tags: string[];
    cf_interesses: string;
    cf_ultima_sincronizacao: string;
    cf_company_name?: string;
    cf_position?: string;
  }

  const basePayload: BasePayload = {
    name: `${firstname} ${surname}`,
    email,
    personal_phone: phone || undefined,
    tags: interesses,
    cf_interesses: interesses.join(', '),
    cf_ultima_sincronizacao: new Date().toISOString(),
    cf_company_name: undefined,
    cf_position: undefined,
  };

  if (company) basePayload.cf_company_name = company;
  if (job_title) basePayload.cf_position = job_title;

  try {
    const getResponse = await axios.get(
      `https://api.rd.services/platform/contacts/email:${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const existingUuid = getResponse.data.uuid;

    if (existingUuid) {
      const patchResponse = await axios.patch(
        `https://api.rd.services/platform/contacts/${existingUuid}`,
        basePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      Logger.debug(
        Logger.PREFIXES.RD,
        '✅ Lead criado com sucesso (detalhes):',
        patchResponse.data
      );
      Logger.success(Logger.PREFIXES.RD, '✅ Lead criado com sucesso.');
      return;
    }
  } catch (error: unknown) {
    // Type guard para AxiosError
    if (typeof error === 'object' && error !== null && 'response' in error) {
      interface AxiosErrorResponse {
        response?: { status?: number; data?: unknown };
        message?: string;
      }
      const axiosError = error as AxiosErrorResponse;
      if (axiosError.response?.status === 404) {
        try {
          const postResponse = await axios.post(
            'https://api.rd.services/platform/contacts',
            basePayload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          Logger.debug(
            Logger.PREFIXES.RD,
            '✅ Lead criado com sucesso (detalhes):',
            postResponse.data
          );
          Logger.success(Logger.PREFIXES.RD, '✅ Lead criado com sucesso.');
          return;
        } catch (postError: unknown) {
          if (
            typeof postError === 'object' &&
            postError !== null &&
            'response' in postError
          ) {
            const axiosPostError = postError as {
              response?: { status?: number; data?: unknown };
              message?: string;
            };
            const msg = axiosPostError.response?.data || axiosPostError.message;
            Logger.error(Logger.PREFIXES.RD, '❌ Erro ao criar lead:', msg);
            throw new Error(
              `RD Station API erro: ${axiosPostError.response?.status} - ${JSON.stringify(msg)}`
            );
          } else {
            Logger.error(
              Logger.PREFIXES.RD,
              '❌ Erro ao criar lead:',
              String(postError)
            );
            throw postError;
          }
        }
      } else {
        const msg = axiosError.response?.data || axiosError.message;
        Logger.error(
          Logger.PREFIXES.RD,
          '❌ Erro ao buscar lead existente:',
          msg
        );
        throw new Error(
          `RD Station API erro: ${axiosError.response?.status} - ${JSON.stringify(msg)}`
        );
      }
    } else {
      Logger.error(
        Logger.PREFIXES.RD,
        '❌ Erro desconhecido ao buscar lead existente:',
        String(error)
      );
      throw error;
    }
  }
}
