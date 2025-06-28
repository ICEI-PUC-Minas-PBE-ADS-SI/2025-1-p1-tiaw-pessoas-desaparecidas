// Página de casos resolvidos

let todosCasosResolvidos = []
let casosResolvidosFiltrados = []

document.addEventListener("DOMContentLoaded", () => {
  carregarCasosResolvidos()
  configurarOuvintesEventos()
})

// Atualizar a função carregarCasosResolvidos
async function carregarCasosResolvidos() {
  try {
    const resposta = await fetch("http://localhost:3000/casos-resolvidos")
    todosCasosResolvidos = await resposta.json()
    casosResolvidosFiltrados = [...todosCasosResolvidos]
    exibirResultados()
    atualizarContador()
    calcularEstatisticas()
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro)
    mostrarSemResultados()
  }
}

function configurarOuvintesEventos() {
  const campoBusca = document.getElementById("entrada-busca")
  const filtroLocalizacao = document.getElementById("filtro-localizacao")
  const filtroAno = document.getElementById("filtro-ano")
  const filtroResultado = document.getElementById("filtro-resultado")
  const filtroOrdenacao = document.getElementById("filtro-ordenacao")

  campoBusca.addEventListener("input", filtrarResultados)
  filtroLocalizacao.addEventListener("change", filtrarResultados)
  filtroAno.addEventListener("change", filtrarResultados)
  filtroResultado.addEventListener("change", filtrarResultados)
  filtroOrdenacao.addEventListener("change", filtrarResultados)
}

function filtrarResultados() {
  const termoBusca = document.getElementById("entrada-busca").value.toLowerCase()
  const filtroLocalizacao = document.getElementById("filtro-localizacao").value
  const filtroAno = document.getElementById("filtro-ano").value
  const filtroResultado = document.getElementById("filtro-resultado").value
  const filtroOrdenacao = document.getElementById("filtro-ordenacao").value

  casosResolvidosFiltrados = todosCasosResolvidos.filter((caso) => {
    const correspondeNome = caso.nome.toLowerCase().includes(termoBusca)
    const correspondeLocalizacao = !filtroLocalizacao || caso.localizacao === filtroLocalizacao
    const correspondeAno = !filtroAno || caso.ano.toString() === filtroAno
    const correspondeResultado = !filtroResultado || caso.resultado === filtroResultado

    return correspondeNome && correspondeLocalizacao && correspondeAno && correspondeResultado
  })

  // Aplicar ordenação
  switch (filtroOrdenacao) {
    case "recentes":
      casosResolvidosFiltrados.sort((a, b) => new Date(b.dataResolucao) - new Date(a.dataResolucao))
      break
    case "antigos":
      casosResolvidosFiltrados.sort((a, b) => new Date(a.dataResolucao) - new Date(b.dataResolucao))
      break
    case "nome":
      casosResolvidosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome))
      break
    case "duracao":
      casosResolvidosFiltrados.sort((a, b) => a.diasDesaparecida - b.diasDesaparecida)
      break
  }

  exibirResultados()
  atualizarContador()
}

// Atualizar a função exibirResultados para usar os nomes corretos das propriedades
function exibirResultados() {
  const recipienteResultados = document.getElementById("resolvedResults")
  const divSemResultados = document.getElementById("noResults")
  const divCarregando = document.getElementById("loading")

  divCarregando.classList.add("d-none")

  if (casosResolvidosFiltrados.length === 0) {
    mostrarSemResultados()
    return
  }

  divSemResultados.classList.add("d-none")

  recipienteResultados.innerHTML = casosResolvidosFiltrados
    .map(
      (caso) => `
        <div class="col-lg-4 col-md-6">
            <div class="card border-info border-2 h-100 shadow-sm">
                <img src="${caso.foto}" class="card-img-top foto-pessoa" alt="${caso.nome}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold mb-0">${caso.nome}</h5>
                        <span class="badge ${obterClasseDistintivoResultado(caso.resultado)}">${obterTextoResultado(caso.resultado)}</span>
                    </div>
                    <p class="card-text text-muted mb-2">
                        <i class="fas fa-user me-1"></i>${caso.idade} anos • 
                        <i class="fas fa-map-marker-alt me-1"></i>${caso.localizacao}
                    </p>
                    <p class="card-text text-muted mb-2">
                        <i class="fas fa-calendar me-1"></i>Resolvido em: ${formatarData(caso.dataResolucao)}
                    </p>
                    <p class="card-text text-muted mb-3">
                        <i class="fas fa-clock me-1"></i>Desaparecido por: ${caso.diasDesaparecida} dias
                    </p>
                    <div class="bg-light p-3 rounded">
                        <h6 class="fw-semibold mb-2">Resolução:</h6>
                        <p class="card-text small text-muted mb-0">${caso.descricao}</p>
                    </div>
                </div>
                <div class="card-footer bg-info bg-opacity-10 border-info">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-info fw-semibold">
                            <i class="fas fa-clipboard-check me-1"></i>Caso Resolvido
                        </small>
                        <button class="btn btn-outline-info btn-sm" onclick="compartilharCasoResolvido(${JSON.stringify(caso).replace(/"/g, "&quot;")})">
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
  const recipienteResultados = document.getElementById("resolvedResults")
  const divSemResultados = document.getElementById("noResults")
  const divCarregando = document.getElementById("loading")

  divCarregando.classList.add("d-none")
  recipienteResultados.innerHTML = ""
  divSemResultados.classList.remove("d-none")
}

// Atualizar a função atualizarContador
function atualizarContador() {
  const elementoContador = document.getElementById("total-resolved-count")
  if (elementoContador) {
    elementoContador.textContent = `${casosResolvidosFiltrados.length} resolvido${casosResolvidosFiltrados.length !== 1 ? "s" : ""}`
  }
}

function obterClasseDistintivoResultado(resultado) {
  switch (resultado) {
    case "encontrado_seguro":
      return "bg-success"
    case "retornou_casa":
      return "bg-primary"
    default:
      return "bg-info"
  }
}

function obterTextoResultado(resultado) {
  switch (resultado) {
    case "encontrado_seguro":
      return "ENCONTRADO SEGURO"
    case "retornou_casa":
      return "RETORNOU PARA CASA"
    default:
      return "RESOLVIDO"
  }
}

function compartilharCasoResolvido(caso) {
  const mensagem = `✅ Caso resolvido! ${caso.nome} - ${obterTextoResultado(caso.resultado)}\n\n${caso.descricao}\n\nVia EncontreMe - Ajudamos a encontrar pessoas`

  if (navigator.share) {
    navigator.share({
      title: `Caso resolvido: ${caso.nome}`,
      text: mensagem,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(mensagem).then(() => {
      alert("Informações do caso copiadas para a área de transferência!")
    })
  }
}

function formatarData(stringData) {
  const data = new Date(stringData)
  return data.toLocaleDateString("pt-BR")
}

// Atualizar a função calcularEstatisticas
function calcularEstatisticas() {
  if (todosCasosResolvidos.length === 0) return

  // Calcular tempo médio
  const totalDias = todosCasosResolvidos.reduce((soma, caso) => soma + caso.diasDesaparecida, 0)
  const mediaDias = Math.round(totalDias / todosCasosResolvidos.length)

  // Contar casos deste ano
  const anoAtual = new Date().getFullYear()
  const casosEsteAno = todosCasosResolvidos.filter((caso) => caso.ano === anoAtual).length

  // Atualizar elementos na página
  const elementoTempoMedio = document.getElementById("average-time")
  const elementoCasosEsteAno = document.getElementById("this-year-count")
  const elementoTotalHistorico = document.getElementById("total-historical")

  if (elementoTempoMedio) {
    elementoTempoMedio.textContent = `${mediaDias} dias`
  }

  if (elementoCasosEsteAno) {
    elementoCasosEsteAno.textContent = casosEsteAno.toString()
  }

  if (elementoTotalHistorico) {
    elementoTotalHistorico.textContent = todosCasosResolvidos.length.toString()
  }

  console.log(`Estatísticas dos Casos Resolvidos:
    - Total de casos resolvidos: ${todosCasosResolvidos.length}
    - Tempo médio para resolução: ${mediaDias} dias
    - Casos resolvidos este ano: ${casosEsteAno}
  `)
}
