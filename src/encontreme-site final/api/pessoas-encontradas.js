// API Route para pessoas encontradas
import fs from "fs"
import path from "path"

function lerDados() {
  const caminhoArquivo = path.join(process.cwd(), "data", "db.json")
  const dadosJson = fs.readFileSync(caminhoArquivo, "utf8")
  return JSON.parse(dadosJson)
}

function salvarDados(dados) {
  const caminhoArquivo = path.join(process.cwd(), "data", "db.json")
  fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2))
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  try {
    const dados = lerDados()

    if (req.method === "GET") {
      res.status(200).json(dados["pessoas-encontradas"])
    } else if (req.method === "POST") {
      const novaPessoa = req.body
      const proximoId = Math.max(...dados["pessoas-encontradas"].map((p) => p.id), 0) + 1
      novaPessoa.id = proximoId

      dados["pessoas-encontradas"].push(novaPessoa)
      salvarDados(dados)

      res.status(201).json(novaPessoa)
    } else {
      res.status(405).json({ error: "Método não permitido" })
    }
  } catch (error) {
    console.error("Erro na API:", error)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}
