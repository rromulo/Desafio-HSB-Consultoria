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

```text
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
```

A arquitetura segue o padrão:

---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, é necessário ter instalado:

- Node.js (>= 22)
- Docker
- Docker Compose
- Conta no Firebase (Firestore habilitado)

---

## 🔑 Configuração do Firebase

1. Criar um projeto no Firebase: http://console.firebase.google.com
2. Ativar o Firestore
3. Gerar uma chave de serviço (Service Account)
4. Baixar o arquivo JSON

Após isso:

Salvar o arquivo como:

```text
firebase-key.json
```

Colocar em:

- backend/firebase-key.json

> ⚠️ Este arquivo está no .gitignore e não deve ser versionado.

---

## 🛠️ Configuração das Variáveis de Ambiente

Já existem dois arquivos no frontend e backend:

- backend/.env.docker

Com o seguinte conteúdo:

```env
PORT=3000
REDIS_HOST=redis
FIREBASE_KEY_PATH=/app/firebase-key.json
```
- frontend/.env.docker

Com o seguinte conteúdo:

```env
VITE_API_BASE_URL=/api
```

▶️ Como Executar o Projeto

Subir toda a aplicação com Docker

## Na raiz do projeto:
```bash
docker compose up --build
```
## Após subir os containers:

API: http://localhost:3000

Frontend: http://localhost:5173

## 🧪 Execução em Ambiente de Desenvolvimento (Sem Docker Compose)

### 📌 Rodando o Projeto sem Docker Compose (Ambiente Local)

Este projeto utiliza Redis para gerenciamento de filas e processamento assíncrono (BullMQ + Worker).
Por isso, é obrigatório ter o Redis em execução, mesmo ao rodar o projeto sem Docker Compose.

Caso você não utilize o docker-compose, siga as instruções abaixo.
### ⚙️ Opção 1 — Rodando o Redis com Docker (Recomendado)

Mesmo que você não utilize Docker Compose para o projeto inteiro, é recomendado usar Docker apenas para o Redis.

- Execute o comando:
```bash
docker run -d \
  --name redis-local \
  -p 6379:6379 \
  redis:7

```
Após isso, o Redis ficará disponível em:
```text
localhost:6379
```


Criar o arquivo:

backend/.env

Com o seguinte conteúdo:

```env
PORT=3000
REDIS_HOST=localhost
FIREBASE_KEY_PATH=./firebase-key.json
```
frontend/.env

Com o seguinte conteúdo:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Backend
```bash
cd backend
npm install
npm run dev:api
npm run dev:worker
```
Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📡 Endpoints da API

### Criar empresa
POST /api/companies

Body:
```json
{
  "razaoSocial": "Empresa Teste",
  "cnpj": "50404088000114",
  "dataInicio": "2026-01-01",
  "dataFim": "2026-12-31"
}
```
### Listar empresas

GET /api/companies

### Buscar por empresa

GET /api/companies/{companyId}

### Enviar job para empresa

POST /api/companies/{companyId}/jobs

Body:
```json
{
  "task": "Processar dados"
}
```

### Buscar job por empresa

GET /api/companies/{companyId}/jobs

## 🖥️ Frontend
O frontend permite:

- Cadastro de empresas
- Listagem de empresas
- Envio de jobs para processamento
- Visualização de jobs e empresa
- A comunicação com o backend é realizada via API REST

## 🔄 Fluxo de Processamento

1. O usuário cadastra uma empresa
2. A empresa é salva no Firestore
3. Um job é enviado para a fila no Redis
4. O Worker consome a fila via BullMQ

A tarefa é processada de forma assíncrona

Este fluxo garante escalabilidade e desacoplamento entre requisições e processamento.


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

📬 Contato

Em caso de dúvidas, sugestões ou feedback, fique à vontade para entrar em contato.

email: rromulo.silva21@gmail.com
telefone: (84) 9 8181-3587

---