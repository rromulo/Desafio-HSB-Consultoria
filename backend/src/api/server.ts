import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import companyRoutes from "../modules/companies/companies.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.use("/api", companyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
