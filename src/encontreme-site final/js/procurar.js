// JavaScript para funcionalidade de busca

let todasPessoas = []
let pessoasFiltradas = []

// Declare apiRequest and API_CONFIG variables
const apiRequest = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  return await response.json()
}

const API_CONFIG = {
  endpoints: {
    pessoasDesaparecidas: "http://localhost:3000/pessoas-desaparecidas",
  },
}

document.addEventListener("DOMContentLoaded", () => {
  carregarPessoasDesaparecidas()
  configurarOuvintesEventos()
})

// Atualizar a função carregarPessoasDesaparecidas
async function carregarPessoasDesaparecidas() {
  try {
    // Usar nova configuração da API
    const pessoasServidor = await apiRequest(API_CONFIG.endpoints.pessoasDesaparecidas)

    // Carregar dados do armazenamento local
    const pessoasArmazenamentoLocal = JSON.parse(localStorage.getItem("pessoas-desaparecidas") || "[]")

    // Combinar os dados
    const mapaPessoas = new Map()
    pessoasServidor.forEach((pessoa) => mapaPessoas.set(pessoa.id, pessoa))
    pessoasArmazenamentoLocal.forEach((pessoa) => mapaPessoas.set(pessoa.id, pessoa))

    todasPessoas = Array.from(mapaPessoas.values())
    pessoasFiltradas = [...todasPessoas]

    exibirResultados()
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro)
    
    const pessoasArmazenamentoLocal = JSON.parse(localStorage.getItem("pessoas-desaparecidas") || "[]")
    todasPessoas = pessoasArmazenamentoLocal
    pessoasFiltradas = [...todasPessoas]

    if (todasPessoas.length === 0) {
      mostrarSemResultados()
    } else {
      exibirResultados()
    }
  }
}

function configurarOuvintesEventos() {
  const campoBusca = document.getElementById("entrada-busca")
  const filtroGenero = document.getElementById("filtro-genero")
  const filtroIdade = document.getElementById("filtro-idade")
  const filtroBairro = document.getElementById("filtro-bairro")

  campoBusca.addEventListener("input", filtrarResultados)
  filtroGenero.addEventListener("change", filtrarResultados)
  filtroIdade.addEventListener("change", filtrarResultados)
  filtroBairro.addEventListener("change", filtrarResultados)
}

function filtrarResultados() {
  const termoBusca = document.getElementById("entrada-busca").value.toLowerCase()
  const filtroGenero = document.getElementById("filtro-genero").value
  const filtroIdade = document.getElementById("filtro-idade").value
  const filtroBairro = document.getElementById("filtro-bairro").value

  pessoasFiltradas = todasPessoas.filter((pessoa) => {
    const correspondeNome = pessoa.nome.toLowerCase().includes(termoBusca)
    const correspondeGenero = !filtroGenero || pessoa.genero === filtroGenero
    const correspondeIdade = !filtroIdade || pessoa.faixaEtaria === filtroIdade
    const correspondeBairro = !filtroBairro || pessoa.bairro === filtroBairro

    return correspondeNome && correspondeGenero && correspondeIdade && correspondeBairro
  })

  exibirResultados()
}

// função exibirResultados
function exibirResultados() {
  const recipienteResultados = document.getElementById("resultados-busca")
  const divSemResultados = document.getElementById("sem-resultados")

  if (pessoasFiltradas.length === 0) {
    mostrarSemResultados()
    return
  }

  divSemResultados.classList.add("d-none")

  recipienteResultados.innerHTML = pessoasFiltradas
    .map(
      (pessoa) => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card cartao-pessoa h-100 border-primary border-2">
                <img src="${pessoa.foto}" class="card-img-top foto-pessoa" alt="${pessoa.nome}">
                <div class="card-body text-center">
                    <h5 class="card-title fw-bold mb-1">${pessoa.nome}</h5>
                    <p class="card-text text-muted mb-1">${pessoa.idade} anos</p>
                    <p class="card-text text-muted mb-3">${pessoa.localizacao}</p>
                    <a href="pessoa.html?id=${pessoa.id}" class="btn btn-primary w-100">Ver mais</a>
                </div>
            </div>
        </div>
    `,
    )
    .join("")


  recipienteResultados.querySelectorAll(".card").forEach((cartao, indice) => {
    cartao.style.animationDelay = `${indice * 0.1}s`
    cartao.classList.add("aparecer")
  })
}

function mostrarSemResultados() {
  const recipienteResultados = document.getElementById("resultados-busca")
  const divSemResultados = document.getElementById("sem-resultados")

  recipienteResultados.innerHTML = ""
  divSemResultados.classList.remove("d-none")
}

// Função para formatar data
function formatarData(stringData) {
  const opcoes = { year: "numeric", month: "long", day: "numeric" }
  return new Date(stringData).toLocaleDateString("pt-BR", opcoes)
}

// Exportar funções para uso em outros scripts
window.funcoesBusca = {
  compartilharCaso: (pessoa) => {
    if (navigator.share) {
      navigator.share({
        title: `Ajude a encontrar ${pessoa.nome}`,
        text: `${pessoa.nome}, ${pessoa.idade} anos, desaparecido(a) desde ${formatarData(pessoa.ultimaVezVisto)}`,
        url: `${window.location.origin}/pessoa.html?id=${pessoa.id}`,
      })
    } else {
      const url = `${window.location.origin}/pessoa.html?id=${pessoa.id}`
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copiado para a área de transferência!")
      })
    }
  },
}
