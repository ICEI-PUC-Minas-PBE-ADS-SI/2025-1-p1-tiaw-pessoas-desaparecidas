// Página de detalhes da pessoa

document.addEventListener("DOMContentLoaded", () => {
  const parametrosUrl = new URLSearchParams(window.location.search)
  const idPessoa = parametrosUrl.get("id")

  if (idPessoa) {
    carregarDetalhesPessoa(idPessoa)
  } else {
    mostrarNaoEncontrado()
  }
})

// Atualizar a função carregarDetalhesPessoa
async function carregarDetalhesPessoa(idPessoa) {
  try {
    const resposta = await fetch("http://localhost:3000/pessoas-desaparecidas")
    const pessoas = await resposta.json()
    const pessoa = pessoas.find((p) => p.id == idPessoa)

    if (pessoa) {
      exibirDetalhesPessoa(pessoa)
    } else {
      mostrarNaoEncontrado()
    }
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro)
    mostrarNaoEncontrado()
  }
}

// Atualizar a função exibirDetalhesPessoa
function exibirDetalhesPessoa(pessoa) {
  const divCarregando = document.getElementById("loading")
  const divDetalhes = document.getElementById("personDetails")

  divCarregando.classList.add("d-none")

  divDetalhes.innerHTML = `
        <div class="row">
            <!-- Foto e Informações Básicas -->
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <img src="${pessoa.foto}" class="img-fluid rounded mb-4" alt="${pessoa.nome}">
                        <div class="text-center">
                            <h2 class="fw-bold mb-3">${pessoa.nome}</h2>
                            <span class="badge bg-danger fs-6 mb-4">DESAPARECIDO(A)</span>
                            <div class="text-start">
                                <p class="mb-2"><strong>Idade:</strong> ${pessoa.idade} anos</p>
                                <p class="mb-2"><strong>Gênero:</strong> ${pessoa.genero}</p>
                                <p class="mb-2"><strong>Altura:</strong> ${pessoa.altura}</p>
                                <p class="mb-2"><strong>Peso:</strong> ${pessoa.peso}</p>
                                <p class="mb-2"><strong>Olhos:</strong> ${pessoa.corOlhos}</p>
                                <p class="mb-2"><strong>Cabelo:</strong> ${pessoa.corCabelo}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Botões de Ação -->
                <div class="mt-4 d-grid gap-2">
                    <button class="btn btn-outline-primary" onclick="compartilharCaso(${JSON.stringify(pessoa).replace(/"/g, "&quot;")})">
                        <i class="fas fa-share-alt me-2"></i>Compartilhar
                    </button>
                    <button class="btn btn-success" onclick="reportarInformacoes(${pessoa.id})">
                        <i class="fas fa-phone me-2"></i>Tenho Informações
                    </button>
                    <a href="tel:190" class="btn btn-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>Emergência: 190
                    </a>
                </div>
            </div>
            
            <!-- Informações Detalhadas -->
            <div class="col-lg-8">
                <!-- Descrição -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-user me-2"></i>Descrição Física</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted">${pessoa.descricao}</p>
                    </div>
                </div>

                <!-- Detalhes do Desaparecimento -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-calendar me-2"></i>Detalhes do Desaparecimento</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h6 class="fw-semibold mb-2">Data do Desaparecimento</h6>
                            <p class="text-muted">${formatarData(pessoa.ultimaVezVisto)}</p>
                        </div>
                        <div class="mb-3">
                            <h6 class="fw-semibold mb-2">Última Localização</h6>
                            <p class="text-muted">${pessoa.localUltimaVezVisto}</p>
                            <p class="text-muted small">Bairro: ${pessoa.bairro}</p>
                        </div>
                        <div>
                            <h6 class="fw-semibold mb-2">Circunstâncias</h6>
                            <p class="text-muted">${pessoa.circunstancias}</p>
                        </div>
                    </div>
                </div>

                <!-- Informações de Contato -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header">
                        <h5 class="mb-0"><i class="fas fa-phone me-2"></i>Informações de Contato</h5>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-info">
                            <p class="mb-2"><strong>Se você tem informações sobre ${pessoa.nome}, entre em contato:</strong></p>
                            <p class="mb-1"><strong>Responsável:</strong> ${pessoa.nomeContato}</p>
                            <p class="mb-0"><strong>Telefone:</strong> ${formatarTelefone(pessoa.telefoneContato)}</p>
                        </div>
                    </div>
                </div>

                <!-- Informações do Registro -->
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h5 class="mb-0">Informações do Registro</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted small mb-1"><strong>Data do registro:</strong> ${formatarData(pessoa.dataRegistro)}</p>
                        <p class="text-muted small mb-0"><strong>ID do caso:</strong> #${pessoa.idCaso}</p>
                    </div>
                </div>
            </div>
        </div>
    `
}

function mostrarNaoEncontrado() {
  const divCarregando = document.getElementById("carregando")
  const divNaoEncontrado = document.getElementById("nao-encontrado")

  divCarregando.classList.add("d-none")
  divNaoEncontrado.classList.remove("d-none")
}

function compartilharCaso(pessoa) {
  if (navigator.share) {
    navigator.share({
      title: `Ajude a encontrar ${pessoa.nome}`,
      text: `${pessoa.nome}, ${pessoa.idade} anos, desaparecido(a) desde ${formatarData(pessoa.ultimaVezVisto)}`,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Link copiado para a área de transferência!")
    })
  }
}

function reportarInformacoes(idPessoa) {
  const mensagem = `Gostaria de reportar informações sobre o caso #${idPessoa.toString().padStart(6, "0")}`
  const telefone = "11999999999"
  const urlWhatsapp = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`
  window.open(urlWhatsapp, "_blank")
}

function formatarData(stringData) {
  const data = new Date(stringData)
  return data.toLocaleDateString("pt-BR")
}

function formatarTelefone(telefone) {
  return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}
