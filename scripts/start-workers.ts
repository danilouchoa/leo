import { spawn } from 'child_process';

import { Logger } from '../lib/logger/logger';

function startWorker(name: string, relativePath: string, color: string) {
  const child = spawn('npx', ['tsx', relativePath], {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
  });

  child.stdout.on('data', (data) =>
    process.stdout.write(`${color}[${name}] ${data}\x1b[0m`)
  );
  child.stderr.on('data', (data) =>
    process.stderr.write(`${color}[${name} ERROR] ${data}\x1b[0m`)
  );

  child.on('close', (code) => {
    Logger.success(
      Logger.PREFIXES.WORKER,
      `[${name}] Finalizado com código ${code}`
    );
  });
}

startWorker('EMAIL', 'lib/worker/email-worker.ts', '\x1b[36m');
startWorker('RD', 'lib/worker/rd-worker.ts', '\x1b[35m');
