import { Worker } from 'bullmq';
import { redis } from '../config/redis';
import { db } from '../config/firebase';

new Worker(
  "company-jobs",
  async(job) => {
    const {companyId, data} = job.data;
    console.log(`job ${job.id} em processo. Empresa ${companyId}`);

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Job Finalizado');
    
  },
  {
    connection: redis
  }
)
console.log(`Worker rodando`);
