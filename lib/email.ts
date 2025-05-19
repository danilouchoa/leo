import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import { Logger } from '@/lib/logger/logger';

interface EmailPayload {
  firstname: string;
  surname: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  interests?: string[];
}

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function isValidEmail(email?: string) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function sendEmail(data: EmailPayload) {
  const {
    firstname,
    surname,
    email: rawEmail,
    phone,
    company,
    jobTitle,
    interests,
  } = data;
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';

  if (!isValidEmail(email)) {
    Logger.error(Logger.PREFIXES.EMAIL, 'E-mail inválido:', email);
    throw new Error('E-mail inválido.');
  }

  const html = `
    <div style="background-color:#0A1D3B;padding:32px 0;">
      <div style="max-width:600px;margin:0 auto;background-color:#1F2937;border-radius:8px;padding:32px;font-family:'Segoe UI',sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.15);color:#F9FAFB;">
        
        <div style="text-align:center;margin-bottom:24px;">
          <img src="https://dev.cdn.oraex.com/logo+azul.png" alt="ORAEX" style="max-width:180px;padding-top:8px;" />
        </div>

        <h2 style="font-size:20px;text-align:center;margin:0 0 4px;font-weight:600;">📥 Novo Lead Registrado no Live Engine</h2>
        <p style="text-align:center;font-size:14px;color:#CBD5E1;margin:0 0 24px;">Confira abaixo os dados preenchidos:</p>

          <table style="width:100%;margin-top:24px;font-size:14px;color:#1F2937;">
            <tr><td style="padding:6px 0;"><strong>👤 Nome:</strong></td><td>${firstname} ${surname}</td></tr>
            <tr><td style="padding:6px 0;"><strong>📧 Email:</strong></td><td>${email}</td></tr>
            <tr><td style="padding:6px 0;"><strong>📱 Telefone:</strong></td><td>${phone ?? 'Não informado'}</td></tr>
            <tr><td style="padding:6px 0;"><strong>🏢 Empresa:</strong></td><td>${company ?? 'Não informado'}</td></tr>
            <tr><td style="padding:6px 0;"><strong>💼 Cargo:</strong></td><td>${jobTitle ?? 'Não informado'}</td></tr>
            <tr><td style="padding:6px 0;"><strong>🧠 Interesses:</strong></td><td>${interests?.join(', ') || 'Não informado'}</td></tr>
          </table>

        <p style="margin-top:24px;font-size:14px;color:#E2E8F0;text-align:center;">
          Este lead foi registrado com sucesso e receberá mais informações automaticamente.
        </p>

        <div style="text-align:center;margin-top:32px;">
          <a href="https://painel.oraex.com/leads"
            style="background-color:#00B2FF;color:#fff;padding:12px 24px;border-radius:6px;
                    font-weight:bold;text-decoration:none;font-size:14px;display:inline-block;
                    text-transform:uppercase;letter-spacing:0.5px;">
            📊 Ver Lead no Painel
          </a>
        </div>

        <hr style="margin:40px 0;border:none;border-top:1px solid #334155;" />

        <p style="text-align:center;font-size:13px;color:#94A3B8;">
          Este e-mail foi enviado automaticamente pelo sistema Live Engine da ORAEX.
        </p>

        <p style="text-align:center; margin-top:40px; font-size:13px; color:#3B82F6;">
          🔗 <a href="https://oraex.com/cases" style="color:#3B82F6;text-decoration:underline;">
            Veja como ajudamos empresas a transformar sua infraestrutura com a ORAEX
          </a>
        </p>
      </div>
    </div>
  `;

  const params = {
    Source: process.env.SES_FROM_EMAIL!,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: '📬 Novo lead registrado no Live Engine ORAEX' },
      Body: { Html: { Data: html } },
    },
  };

  try {
    await ses.send(new SendEmailCommand(params));
    Logger.success(
      Logger.PREFIXES.EMAIL,
      `E-mail de lead enviado para: ${email}`
    );
  } catch (error) {
    Logger.error(
      Logger.PREFIXES.EMAIL,
      'Erro ao enviar e-mail de lead:',
      error
    );
    throw new Error('Falha ao enviar o e-mail.');
  }
}

export async function sendConfirmationToLead(data: EmailPayload) {
  const { firstname, email: rawEmail } = data;
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';

  if (!isValidEmail(email)) {
    Logger.error(Logger.PREFIXES.EMAIL, 'E-mail inválido do lead:', email);
    return;
  }

  const html = `
  <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; background-color: #ffffff; border-radius: 8px; padding: 24px; border: 1px solid #e5e7eb;">
    <img src="https://dev.cdn.oraex.com/oraex-logo-alterada.png" alt="ORAEX" style="max-width: 100px; margin-bottom: 20px;" />

    <h2 style="color: #0A1D3B;">Olá ${firstname},</h2>
    <p style="color: #374151;">✅ Sua inscrição no evento da <strong>ORAEX Cloud Consulting</strong> foi confirmada com sucesso!</p>

    <p style="color: #1f2937; margin-top: 16px;">
      Em breve você receberá conteúdos exclusivos sobre Cloud, Segurança, DevOps e muito mais. Fique atento ao seu e-mail!
    </p>

    <p style="margin-top: 20px; color: #1e40af;">
      Atenciosamente,<br/>Equipe ORAEX 🚀
    </p>

    <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />

    <footer style="font-size: 12px; color: #6b7280;">
      Este e-mail foi enviado automaticamente pelo Live Engine. Não é necessário responder.
    </footer>
  </div>
  `;

  const params = {
    Source: process.env.SES_FROM_EMAIL!,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: '🚀 Confirmação da sua inscrição no evento ORAEX' },
      Body: { Html: { Data: html } },
    },
  };

  try {
    await ses.send(new SendEmailCommand(params));
    Logger.success(
      Logger.PREFIXES.EMAIL,
      `Confirmação enviada para o lead: ${email}`
    );
  } catch (error) {
    Logger.error(
      Logger.PREFIXES.EMAIL,
      'Erro ao enviar confirmação ao lead:',
      error
    );
  }
}
