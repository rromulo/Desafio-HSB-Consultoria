// companies.service.ts
import { db } from "../../config/firebase";
import { CompanyQueueService } from '../queues/queue.service';

type CreateCompanyDTO = {
  razaoSocial: string;
  cnpj: string;
  dataInicio: string;
  dataFim: string;
};

export class CompaniesService {
  private collection = db.collection("companies");
  private companyQueue: CompanyQueueService;

  constructor() {
    this.companyQueue = new CompanyQueueService();
  }

  async createCompany(data: CreateCompanyDTO) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date(),
    });

    const doc = await docRef.get();
    const companyId = doc.id;

    await this.companyQueue.enqueue("init", {
      companyId,
      data: { message: "Fila criada para empresa" }
    });

    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  async listCompanies() {
    const snapshot = await this.collection.get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
    
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || null,
      };
    });
    
  }

  async listCompanyById(companyId: string) {
    const doc = await this.collection.doc(companyId).get();
    
    if(!doc.exists) return null

    const data = doc.data();
    if(!data) return null

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || null,
    };
  }
}