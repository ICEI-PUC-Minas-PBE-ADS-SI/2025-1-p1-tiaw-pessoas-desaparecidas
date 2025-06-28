// API Route para usuários
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
    const { email, senha } = req.query

    if (req.method === "GET") {
      if (email && senha) {
        // Login - buscar usuário por email e senha
        const usuario = dados.usuarios.find((u) => u.email === email && u.senha === senha)
        res.status(200).json(usuario ? [usuario] : [])
      } else if (email) {
        // Verificar se email existe
        const usuario = dados.usuarios.find((u) => u.email === email)
        res.status(200).json(usuario ? [usuario] : [])
      } else {
        // Retornar todos os usuários (sem senhas)
        const usuariosSemSenha = dados.usuarios.map((u) => ({
          id: u.id,
          nome: u.nome,
          email: u.email,
          telefone: u.telefone,
          dataRegistro: u.dataRegistro,
          ativo: u.ativo,
        }))
        res.status(200).json(usuariosSemSenha)
      }
    } else if (req.method === "POST") {
      const novoUsuario = req.body
      const proximoId = Math.max(...dados.usuarios.map((u) => u.id), 0) + 1
      novoUsuario.id = proximoId

      dados.usuarios.push(novoUsuario)
      salvarDados(dados)

      // Retornar usuário sem senha
      const { senha, ...usuarioSemSenha } = novoUsuario
      res.status(201).json(usuarioSemSenha)
    } else {
      res.status(405).json({ error: "Método não permitido" })
    }
  } catch (error) {
    console.error("Erro na API:", error)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}
