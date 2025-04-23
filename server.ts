import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cvParserRoute from "./routes/cvParserRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", cvParserRoute);

app.listen(PORT, () => {
  console.log(`Backend en écoute sur http://localhost:${PORT}`);
});
