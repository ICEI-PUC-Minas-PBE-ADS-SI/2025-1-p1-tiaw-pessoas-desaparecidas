// Arquivo principal para EncontreMe

document.addEventListener("DOMContentLoaded", () => {
  inicializarComponentesBootstrap()
  carregarCasosRecentes()
  atualizarEstatisticas()
})

// Carregar casos recentes para a página inicial
async function carregarCasosRecentes() {
  try {
    const resposta = await fetch("http://localhost:3000/pessoas-desaparecidas")
    const pessoas = await resposta.json()

    const recipienteCasosRecentes = document.getElementById("casos-recentes")
    if (!recipienteCasosRecentes) return

    // Pegar os primeiros 4 casos
    const casosRecentes = pessoas.slice(0, 4)

    recipienteCasosRecentes.innerHTML = casosRecentes
      .map(
        (pessoa) => `
            <div class="col-md-3">
                <div class="card cartao-pessoa h-100">
                    <img src="${pessoa.foto}" class="card-img-top foto-pessoa" alt="${pessoa.nome}">
                    <div class="card-body text-center">
                        <h5 class="card-title fw-bold">${pessoa.nome}</h5>
                        <p class="card-text text-muted mb-2">${pessoa.idade} anos • ${pessoa.localizacao}</p>
                        <a href="pessoa.html?id=${pessoa.id}" class="btn btn-primary btn-sm">Ver mais</a>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  } catch (erro) {
    console.error("Erro ao carregar casos recentes:", erro)
  }
}

// Atualizar estatísticas na página inicial
async function atualizarEstatisticas() {
  try {
    const [respostaDesaparecidas, respostaEncontradas, respostaResolvidos] = await Promise.all([
      fetch("http://localhost:3000/pessoas-desaparecidas"),
      fetch("http://localhost:3000/pessoas-encontradas"),
      fetch("http://localhost:3000/casos-resolvidos"),
    ])

    const desaparecidas = await respostaDesaparecidas.json()
    const encontradas = await respostaEncontradas.json()
    const resolvidos = await respostaResolvidos.json()

    // Atualizar contadores com animação
    animarContador("total-desaparecidas", desaparecidas.length)
    animarContador("total-encontradas", encontradas.length)
    animarContador("total-resolvidos", resolvidos.length)
  } catch (erro) {
    console.error("Erro ao carregar estatísticas:", erro)
  }
}

// Animar números dos contadores
function animarContador(idElemento, valorFinal) {
  const elemento = document.getElementById(idElemento)
  if (!elemento) return

  let valorAtual = 0
  const incremento = valorFinal / 50
  const temporizador = setInterval(() => {
    valorAtual += incremento
    if (valorAtual >= valorFinal) {
      elemento.textContent = valorFinal.toLocaleString()
      clearInterval(temporizador)
    } else {
      elemento.textContent = Math.floor(valorAtual).toLocaleString()
    }
  }, 30)
}

// Funções utilitárias
function formatarData(stringData) {
  const data = new Date(stringData)
  return data.toLocaleDateString("pt-BR")
}

function formatarTelefone(telefone) {
  return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}

function mostrarAlerta(mensagem, tipo = "info") {
  const divAlerta = document.createElement("div")
  divAlerta.className = `alert alert-${tipo} alert-dismissible fade show`
  divAlerta.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.insertBefore(divAlerta, document.body.firstChild)

  setTimeout(() => {
    divAlerta.remove()
  }, 5000)
}

// Funcionalidade de compartilhamento
function compartilharCaso(pessoa) {
  if (navigator.share) {
    navigator.share({
      title: `Ajude a encontrar ${pessoa.nome}`,
      text: `${pessoa.nome}, ${pessoa.idade} anos, desaparecido(a) desde ${formatarData(pessoa.ultimaVezVisto)}`,
      url: `${window.location.origin}/pessoa.html?id=${pessoa.id}`,
    })
  } else {
    // Alternativa para área de transferência
    const url = `${window.location.origin}/pessoa.html?id=${pessoa.id}`
    navigator.clipboard.writeText(url).then(() => {
      mostrarAlerta("Link copiado para a área de transferência!", "success")
    })
  }
}

// Funcionalidade para reportar informações
function reportarInformacoes(idPessoa) {
  const mensagem = `Gostaria de reportar informações sobre o caso #${idPessoa.toString().padStart(6, "0")}`
  const telefone = "11999999999"
  const urlWhatsapp = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`
  window.open(urlWhatsapp, "_blank")
}

// Funcionalidade de chamada de emergência
function ligarEmergencia() {
  window.location.href = "tel:190"
}

// Validação de formulário
function validarFormulario(idFormulario) {
  const formulario = document.getElementById(idFormulario)
  if (!formulario) return false

  const camposObrigatorios = formulario.querySelectorAll("[required]")
  let ehValido = true

  camposObrigatorios.forEach((campo) => {
    if (!campo.value.trim()) {
      campo.classList.add("is-invalid")
      ehValido = false
    } else {
      campo.classList.remove("is-invalid")
      campo.classList.add("is-valid")
    }
  })

  return ehValido
}

// Auxiliares do armazenamento local
function salvarNoArmazenamentoLocal(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados))
    return true
  } catch (erro) {
    console.error("Erro ao salvar no armazenamento local:", erro)
    return false
  }
}

function obterDoArmazenamentoLocal(chave) {
  try {
    const dados = localStorage.getItem(chave)
    return dados ? JSON.parse(dados) : null
  } catch (erro) {
    console.error("Erro ao ler do armazenamento local:", erro)
    return null
  }
}

function inicializarComponentesBootstrap() {
  // Inicializar dicas de ferramentas
  const listaDicasFerramentas = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  listaDicasFerramentas.map((elementoDica) => new window.bootstrap.Tooltip(elementoDica))

  // Inicializar janelas 
  const listaJanelasPopup = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  listaJanelasPopup.map((elementoJanelaPopup) => new window.bootstrap.Popover(elementoJanelaPopup))
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarComponentesBootstrap()
  carregarCasosRecentes()
  atualizarEstatisticas()
})
