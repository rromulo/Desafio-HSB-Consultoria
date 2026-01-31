import { Worker } from 'bullmq';
import { redis } from '../config/redis';
import IORedis from 'ioredis';

/* Cliente separado pra inspeção */
const redisClient = new IORedis({
  host: process.env.REDIS_HOST || 'redis',
  port: 6379,
});

const workers = new Map<string, Worker>();

/* Cria worker se não existir */
function createWorker(queueName: string) {
  if (workers.has(queueName)) return;

  console.log(`📌 Criando worker para fila: ${queueName}`);

  const worker = new Worker(
    queueName,
    async (job) => {
      const { companyId } = job.data;

      console.log(`⚙️ Job ${job.id} em processo | Empresa ${companyId}`);
      console.log(` Dados: ${JSON.stringify(job.data)}`);

      await new Promise((r) => setTimeout(r, 3000));

    },
    {
      connection: redis,
      concurrency: 5
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} na fila ${queueName} completado`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} na fila ${queueName} falhou:`, err.message);
  });

  worker.on('error', (err) => {
    console.error(`🔥 Erro no worker da fila ${queueName}:`, err);
  });


  workers.set(queueName, worker);
}

/* Busca filas existentes */
async function loadExistingQueues() {
  const keys = await redisClient.keys('bull:company-jobs_*:*');

  const queuesNames = new Set<string>();

  keys.forEach((key) => {
    const match = key.match(/^bull:(company-jobs_[^:]+):/);

    if (match) {
      queuesNames.add(match[1]);
    }
  });

  queuesNames.forEach(queueName => createWorker(queueName));
}

/*Observa novas filas*/
async function watchNewQueues() {
  setInterval(async () => {
    const keys = await redisClient.keys('bull:company-jobs_*:*');
    const queueNames = new Set<string>();

    keys.forEach((key) => {
      const match = key.match(/^bull:(company-jobs_[^:]+):/);
      if (match) {
        queueNames.add(match[1]);
      }
    });

    queueNames.forEach((queueName) => {
      if (!workers.has(queueName)) {
        createWorker(queueName);
      }
    });
  }, 10000);
}

async function shutdown() {
  for (const [queueName, worker] of workers) {
    await worker.close();
    console.log(`Worker da fila ${queueName} fechado`); 
  }
  await redisClient.quit();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function bootstrap() {
  console.log('🚀 Worker iniciado');

  await loadExistingQueues();
  await watchNewQueues();
}

bootstrap().catch(console.error);
