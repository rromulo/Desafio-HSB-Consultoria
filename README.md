# 📦 Desafio Técnico – Cadastro de Empresas com Processamento Assíncrono

Este projeto foi desenvolvido como parte de um desafio técnico, com o objetivo de demonstrar conhecimentos em backend, filas assíncronas, frontend e arquitetura de sistemas.

A aplicação permite o cadastro de empresas, criação de filas individuais por empresa e processamento assíncrono de tarefas utilizando Redis e BullMQ.

---

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js
- TypeScript
- Express
- Firebase Firestore
- Redis
- BullMQ

### Frontend
- React
- Vite
- TypeScript
- TailwindCSS

### Infraestrutura
- Docker
- Docker Compose

---

## 📐 Arquitetura do Projeto

O sistema é composto por três serviços principais:

### 1️⃣ API
Responsável por:
- Cadastro de empresas
- Listagem de empresas
- Enfileiramento de tarefas

### 2️⃣ Worker
Responsável por:
- Processar jobs de forma assíncrona
- Consumir filas do Redis via BullMQ

### 3️⃣ Redis
Responsável por:
- Gerenciamento das filas

---

### 📁 Estrutura do Projeto

backend/
├─ src/
│ ├─ api/
│ ├─ modules/
│ │ ├─ companies/
│ │ └─ queues/
│ ├─ worker/
│ └─ config/

frontend/
├─ src/
│ ├─ components/
│ ├─ pages/
│ └─ services/


A arquitetura segue o padrão:

---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, é necessário ter instalado:

- Node.js (>= 20)
- Docker
- Docker Compose
- Conta no Firebase (Firestore habilitado)

---

## 🔑 Configuração do Firebase

1. Criar um projeto no Firebase
2. Ativar o Firestore
3. Gerar uma chave de serviço (Service Account)
4. Baixar o arquivo JSON

Após isso:

- Salvar o arquivo como:

firebase-key.json

- Colocar em:

backend/src/firebase-key.json

> ⚠️ Este arquivo está no .gitignore e não deve ser versionado.

---

## 🛠️ Configuração das Variáveis de Ambiente

- Criar o arquivo:

backend/.env

Com o seguinte conteúdo:

```env
FIREBASE_PROJECT_ID=seu_project_id
REDIS_HOST=redis
REDIS_PORT=6379

▶️ Como Executar o Projeto

Subir toda a aplicação com Docker

Na raiz do projeto:

docker-compose up --build

- Após subir os containers:

API: http://localhost:3000

Frontend: http://localhost:5173

## 📡 Endpoints da API

-- Criar empresa
POST /api/companies

Body:
{
  "razaoSocial": "Empresa Teste",
  "cnpj": "123456789",
  "dataInicio": "2026-01-01",
  "dataFim": "2026-12-31"
}

-- Listar empresas
GET /api/companies

-- Enviar job para empresa
POST /api/companies/:companyId/jobs

Body:
{
  "task": "Processar dados"
}


## 🖥️ Frontend
O frontend permite:

Cadastro de empresas

Listagem de empresas

Envio de jobs para processamento

A comunicação com o backend é realizada via API REST.

A interface foi construída utilizando React, Vite e TailwindCSS.

## 🔄 Fluxo de Processamento

O usuário cadastra uma empresa

A empresa é salva no Firestore

Um job é enviado para a fila no Redis

O Worker consome a fila via BullMQ

A tarefa é processada de forma assíncrona

Este fluxo garante escalabilidade e desacoplamento entre requisições e processamento.

## 🧪 Execução em Ambiente de Desenvolvimento (Sem Docker)
-- Backend
cd backend
npm install
npm run dev:api
npm run dev:worker

-- Frontend
cd frontend
npm install
npm run dev

## 📌 Decisões Técnicas

Arquitetura em camadas para facilitar manutenção

Separação entre API e Worker

Uso de filas para processamento assíncrono

Docker para padronização do ambiente

Firebase para persistência simples e rápida

Organização baseada em princípios de POO e responsabilidade única

## 🔒 Segurança

Arquivos sensíveis estão protegidos via .gitignore

Credenciais não são versionadas

Variáveis de ambiente são utilizadas para configuração

## 👨‍💻 Autor

Desenvolvido por:

Romulo Rodrigues da Silva
Desenvolvedor Fullstack

📬 Contato

Em caso de dúvidas, sugestões ou feedback, fique à vontade para entrar em contato.

email: rromulo.silva21@gmail.com
telefone: (84) 9 8181-4587

---