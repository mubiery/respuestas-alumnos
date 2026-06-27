import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "respuestas.jsonl";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function saveAnswer(entry) {
  fs.appendFileSync(DATA_FILE, JSON.stringify(entry) + "\n", "utf8");
}

function readAnswers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return fs.readFileSync(DATA_FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

app.post("/api/respuestas", (req, res) => {
  const respuesta1 = String(req.body.respuesta1 || "").trim();
  const respuesta2 = String(req.body.respuesta2 || "").trim();

  if (!respuesta1 && !respuesta2) {
    return res.status(400).json({ ok: false, message: "Escribe al menos una respuesta." });
  }

  const entry = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    respuesta1,
    respuesta2,
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    navegador: req.headers["user-agent"] || ""
  };

  saveAnswer(entry);
  res.json({ ok: true, message: "Respuesta guardada." });
});

app.get("/api/respuestas", (req, res) => {
  res.json(readAnswers().reverse());
});

app.delete("/api/respuestas", (req, res) => {
  fs.writeFileSync(DATA_FILE, "", "utf8");
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});