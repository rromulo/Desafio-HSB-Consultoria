import { db } from "../../config/firebase";
import { getCompanyQueue } from '../queues/queue.service';

type CreateCompanyDTO = {
  razaoSocial: string;
  cnpj: string;
  dataInicio: string;
  dataFim: string;
};

const collection = db.collection("companies");

export async function createCompanyService(data: CreateCompanyDTO) {
  const docRef = await collection.add({
    ...data,
    createdAt: new Date(),
  });

  const doc = await docRef.get();

  const companyId = doc.id;

  const queue = getCompanyQueue();

  await queue.add("init", {
    companyId,
    data:{
      message: "Fila criada para empresa"
    }
  })

  return {
    id: doc.id,
    ...doc.data(),
  };
}

export async function listCompaniesService() {
  const snapshot = await collection.get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
