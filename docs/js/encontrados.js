// Página de pessoas encontradas

let todasPessoasEncontradas = []
let pessoasEncontradasFiltradas = []

document.addEventListener("DOMContentLoaded", () => {
  carregarPessoasEncontradas()
  configurarOuvintesEventos()
})

// Atualizar a função carregarPessoasEncontradas
async function carregarPessoasEncontradas() {
  try {
    // Carregar dados do servidor
    const resposta = await fetch("http://localhost:3000/pessoas-encontradas")
    const pessoasServidor = await resposta.json()

    // Carregar dados do armazenamento local (pessoas cadastradas via formulário)
    const pessoasArmazenamentoLocal = JSON.parse(localStorage.getItem("pessoas-encontradas") || "[]")

    // Combinar os dados, removendo duplicatas por ID
    const mapaPessoas = new Map()

    // Adicionar pessoas do servidor
    pessoasServidor.forEach((pessoa) => mapaPessoas.set(pessoa.id, pessoa))

    // Adicionar pessoas do armazenamento local (sobrescreve se ID já existe)
    pessoasArmazenamentoLocal.forEach((pessoa) => mapaPessoas.set(pessoa.id, pessoa))

    // Converter Map de volta para array
    todasPessoasEncontradas = Array.from(mapaPessoas.values())
    pessoasEncontradasFiltradas = [...todasPessoasEncontradas]

    exibirResultados()
    atualizarContador()
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro)

    // Se falhar, tentar carregar apenas do armazenamento local
    const pessoasArmazenamentoLocal = JSON.parse(localStorage.getItem("pessoas-encontradas") || "[]")
    todasPessoasEncontradas = pessoasArmazenamentoLocal
    pessoasEncontradasFiltradas = [...todasPessoasEncontradas]

    if (todasPessoasEncontradas.length === 0) {
      mostrarSemResultados()
    } else {
      exibirResultados()
      atualizarContador()
    }
  }
}

function configurarOuvintesEventos() {
  const campoBusca = document.getElementById("entrada-busca")
  const filtroLocalizacao = document.getElementById("filtro-localizacao")
  const filtroMes = document.getElementById("filtro-mes")
  const filtroOrdenacao = document.getElementById("filtro-ordenacao")

  campoBusca.addEventListener("input", filtrarResultados)
  filtroLocalizacao.addEventListener("change", filtrarResultados)
  filtroMes.addEventListener("change", filtrarResultados)
  filtroOrdenacao.addEventListener("change", filtrarResultados)
}

function filtrarResultados() {
  const termoBusca = document.getElementById("entrada-busca").value.toLowerCase()
  const filtroLocalizacao = document.getElementById("filtro-localizacao").value
  const filtroMes = document.getElementById("filtro-mes").value
  const filtroOrdenacao = document.getElementById("filtro-ordenacao").value

  pessoasEncontradasFiltradas = todasPessoasEncontradas.filter((pessoa) => {
    const correspondeNome = pessoa.nome.toLowerCase().includes(termoBusca)
    const correspondeLocalizacao = !filtroLocalizacao || pessoa.localizacao === filtroLocalizacao
    const correspondeMes = !filtroMes || pessoa.dataEncontrada.startsWith(filtroMes)

    return correspondeNome && correspondeLocalizacao && correspondeMes
  })

  // Aplicar ordenação
  switch (filtroOrdenacao) {
    case "recentes":
      pessoasEncontradasFiltradas.sort((a, b) => new Date(b.dataEncontrada) - new Date(a.dataEncontrada))
      break
    case "antigos":
      pessoasEncontradasFiltradas.sort((a, b) => new Date(a.dataEncontrada) - new Date(b.dataEncontrada))
      break
    case "nome":
      pessoasEncontradasFiltradas.sort((a, b) => a.nome.localeCompare(b.nome))
      break
  }

  exibirResultados()
  atualizarContador()
}

// Atualizar a função exibirResultados
function exibirResultados() {
  const recipienteResultados = document.getElementById("foundResults")
  const divSemResultados = document.getElementById("noResults")
  const divCarregando = document.getElementById("loading")

  divCarregando.classList.add("d-none")

  if (pessoasEncontradasFiltradas.length === 0) {
    mostrarSemResultados()
    return
  }

  divSemResultados.classList.add("d-none")

  recipienteResultados.innerHTML = pessoasEncontradasFiltradas
    .map(
      (pessoa) => `
        <div class="col-lg-4 col-md-6">
            <div class="card border-success border-2 h-100 shadow-sm">
                <img src="${pessoa.foto}" class="card-img-top foto-pessoa" alt="${pessoa.nome}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold mb-0">${pessoa.nome}</h5>
                        <span class="badge bg-success">ENCONTRADO(A)</span>
                    </div>
                    <p class="card-text text-muted mb-2">
                        <i class="fas fa-user me-1"></i>${pessoa.idade} anos • 
                        <i class="fas fa-map-marker-alt me-1"></i>${pessoa.localizacao}
                    </p>
                    <p class="card-text text-muted mb-2">
                        <i class="fas fa-calendar me-1"></i>Encontrado(a) em: ${formatarData(pessoa.dataEncontrada)}
                    </p>
                    <p class="card-text text-muted mb-3">
                        <i class="fas fa-clock me-1"></i>Desaparecido(a) por: ${pessoa.diasDesaparecida} dias
                    </p>
                    <div class="bg-light p-3 rounded">
                        <h6 class="fw-semibold mb-2">História:</h6>
                        <p class="card-text small text-muted mb-0">${pessoa.historia}</p>
                    </div>
                </div>
                <div class="card-footer bg-success bg-opacity-10 border-success">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-success fw-semibold">
                            <i class="fas fa-check-circle me-1"></i>Caso Resolvido
                        </small>
                        <button class="btn btn-outline-success btn-sm" onclick="compartilharHistoriaSucesso(${JSON.stringify(pessoa).replace(/"/g, "&quot;")})">
                            <i class="fas fa-share-alt me-1"></i>Compartilhar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  // Adicionar animação de aparecer
  recipienteResultados.querySelectorAll(".card").forEach((cartao, indice) => {
    cartao.style.animationDelay = `${indice * 0.1}s`
    cartao.classList.add("aparecer")
  })
}

function mostrarSemResultados() {
  const recipienteResultados = document.getElementById("foundResults")
  const divSemResultados = document.getElementById("noResults")
  const divCarregando = document.getElementById("loading")

  divCarregando.classList.add("d-none")
  recipienteResultados.innerHTML = ""
  divSemResultados.classList.remove("d-none")
}

// Atualizar a função atualizarContador
function atualizarContador() {
  const elementoContador = document.getElementById("total-found-count")
  if (elementoContador) {
    elementoContador.textContent = `${pessoasEncontradasFiltradas.length} encontrada${pessoasEncontradasFiltradas.length !== 1 ? "s" : ""}`
  }
}

function compartilharHistoriaSucesso(pessoa) {
  const mensagem = `🎉 Ótima notícia! ${pessoa.nome} foi encontrado(a)!\n\n${pessoa.historia}\n\nVia EncontreMe - Ajudamos a encontrar pessoas`

  if (navigator.share) {
    navigator.share({
      title: `${pessoa.nome} foi encontrado(a)!`,
      text: mensagem,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(mensagem).then(() => {
      alert("História de sucesso copiada para a área de transferência!")
    })
  }
}

function formatarData(stringData) {
  const data = new Date(stringData)
  return data.toLocaleDateString("pt-BR")
}

// Calcular e exibir estatísticas
function calcularEstatisticas() {
  if (todasPessoasEncontradas.length === 0) return

  const totalDias = todasPessoasEncontradas.reduce((soma, pessoa) => soma + pessoa.diasDesaparecida, 0)
  const mediaDias = Math.round(totalDias / todasPessoasEncontradas.length)

  const esteMes = todasPessoasEncontradas.filter((pessoa) => {
    const dataEncontrada = new Date(pessoa.dataEncontrada)
    const agora = new Date()
    return dataEncontrada.getMonth() === agora.getMonth() && dataEncontrada.getFullYear() === agora.getFullYear()
  }).length

  console.log(`Estatísticas:
    - Total de pessoas encontradas: ${todasPessoasEncontradas.length}
    - Tempo médio desaparecido: ${mediaDias} dias
    - Encontradas este mês: ${esteMes}
  `)
}

// Chamar cálculo de estatísticas após carregar dados
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(calcularEstatisticas, 1000)
})
