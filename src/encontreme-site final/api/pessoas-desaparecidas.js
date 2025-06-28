// API Route para pessoas desaparecidas
import fs from "fs"
import path from "path"

// Ler dados do arquivo JSON
function lerDados() {
  const caminhoArquivo = path.join(process.cwd(), "data", "db.json")
  const dadosJson = fs.readFileSync(caminhoArquivo, "utf8")
  return JSON.parse(dadosJson)
}

// Salvar dados no arquivo JSON
function salvarDados(dados) {
  const caminhoArquivo = path.join(process.cwd(), "data", "db.json")
  fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2))
}

export default function handler(req, res) {
  // Configurar CORS
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
      // Retornar todas as pessoas desaparecidas
      res.status(200).json(dados["pessoas-desaparecidas"])
    } else if (req.method === "POST") {
      // Adicionar nova pessoa desaparecida
      const novaPessoa = req.body

      // Gerar ID único
      const proximoId = Math.max(...dados["pessoas-desaparecidas"].map((p) => p.id), 0) + 1
      novaPessoa.id = proximoId
      novaPessoa.idCaso = proximoId.toString().padStart(6, "0")

      // Adicionar aos dados
      dados["pessoas-desaparecidas"].push(novaPessoa)

      // Salvar arquivo
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
