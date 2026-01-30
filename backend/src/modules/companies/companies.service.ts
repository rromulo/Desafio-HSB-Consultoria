// companies.service.ts
import { db } from "../../config/firebase";
import { CompanyQueue } from '../queues/queue.service';

type CreateCompanyDTO = {
  razaoSocial: string;
  cnpj: string;
  dataInicio: string;
  dataFim: string;
};

export class CompaniesService {
  private collection = db.collection("companies");
  private companyQueue: CompanyQueue;

  constructor() {
    this.companyQueue = new CompanyQueue();
  }

  async createCompany(data: CreateCompanyDTO) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date(),
    });

    const doc = await docRef.get();
    const companyId = doc.id;

    // Usando o método da classe de fila
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

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}