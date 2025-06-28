// formulário de cadastro

document.addEventListener("DOMContentLoaded", () => {
  configurarValidacaoFormulario()
  configurarUploadFoto()
  configurarTipoCadastro()
})

function configurarTipoCadastro() {
  const radioDesaparecida = document.getElementById("missing")
  const radioEncontrada = document.getElementById("found")
  const cartaoInfoEncontrada = document.getElementById("foundInfoCard")

  // Função para mostrar/esconder campos baseado no tipo selecionado
  function alternarCampos() {
    if (radioEncontrada.checked) {
      cartaoInfoEncontrada.style.display = "block"
      // Tornar campos de pessoa encontrada obrigatórios
      document.getElementById("foundDate").required = true
      document.getElementById("foundStory").required = true
      // Remover obrigatoriedade dos campos de desaparecimento
      document.getElementById("lastSeenDate").required = false
      document.getElementById("lastSeenLocation").required = false
    } else {
      cartaoInfoEncontrada.style.display = "none"
      // Remover obrigatoriedade dos campos de pessoa encontrada
      document.getElementById("foundDate").required = false
      document.getElementById("foundStory").required = false
      // Tornar campos de desaparecimento obrigatórios
      document.getElementById("lastSeenDate").required = true
      document.getElementById("lastSeenLocation").required = true
    }
  }

  radioDesaparecida.addEventListener("change", alternarCampos)
  radioEncontrada.addEventListener("change", alternarCampos)

  // Configurar estado inicial
  alternarCampos()
}

function configurarValidacaoFormulario() {
  const formulario = document.getElementById("cadastroForm")

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault()

    if (validarFormulario()) {
      enviarFormulario()
    }
  })
}

function configurarUploadFoto() {
  const inputFoto = document.getElementById("photo")

  inputFoto.addEventListener("change", function (evento) {
    const arquivo = evento.target.files[0]
    if (arquivo) {
      // Validar tipo de arquivo
      if (!arquivo.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem.")
        this.value = ""
        return
      }

      // Validar tamanho do arquivo (máximo 10MB)
      if (arquivo.size > 10 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 10MB.")
        this.value = ""
        return
      }
    }
  })
}

function validarFormulario() {
  const formulario = document.getElementById("cadastroForm")
  const camposObrigatorios = formulario.querySelectorAll("[required]")
  let ehValido = true

  // Limpar validação anterior
  formulario.querySelectorAll(".is-invalid").forEach((campo) => {
    campo.classList.remove("is-invalid")
  })

  // Validar campos obrigatórios
  camposObrigatorios.forEach((campo) => {
    if (!campo.value.trim()) {
      campo.classList.add("is-invalid")
      ehValido = false
    }
  })

  // Validar idade
  const idade = document.getElementById("age").value
  if (idade && (idade < 0 || idade > 120)) {
    document.getElementById("age").classList.add("is-invalid")
    ehValido = false
  }

  // Validar telefone
  const telefone = document.getElementById("contactPhone").value
  const regexTelefone = /^$$\d{2}$$\s\d{4,5}-\d{4}$/
  if (telefone && !regexTelefone.test(telefone)) {
    // formatar telefone automaticamente
    const telefoneLimpo = telefone.replace(/\D/g, "")
    if (telefoneLimpo.length === 11) {
      document.getElementById("contactPhone").value =
        `(${telefoneLimpo.substr(0, 2)}) ${telefoneLimpo.substr(2, 5)}-${telefoneLimpo.substr(7, 4)}`
    } else if (telefoneLimpo.length === 10) {
      document.getElementById("contactPhone").value =
        `(${telefoneLimpo.substr(0, 2)}) ${telefoneLimpo.substr(2, 4)}-${telefoneLimpo.substr(6, 4)}`
    }
  }

  // Validar email se fornecido
  const email = document.getElementById("contactEmail").value
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email && !regexEmail.test(email)) {
    document.getElementById("contactEmail").classList.add("is-invalid")
    ehValido = false
  }

  return ehValido
}

// Substituir a função enviarFormulario para mostrar melhor feedback
async function enviarFormulario() {
  const tipoCadastro = document.querySelector('input[name="registrationType"]:checked').value

  // Mostrar carregamento
  const botaoEnviar = document.querySelector('button[type="submit"]')
  const textoOriginal = botaoEnviar.textContent
  botaoEnviar.disabled = true
  botaoEnviar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cadastrando...'

  try {
    if (tipoCadastro === "missing") {
      await cadastrarPessoaDesaparecida()
    } else {
      await cadastrarPessoaEncontrada()
    }
  } catch (erro) {
    console.error("Erro ao cadastrar:", erro)
    mostrarMensagemSucesso("Erro ao cadastrar pessoa. Tente novamente.", "error")
  } finally {
    // Restaurar botão
    botaoEnviar.disabled = false
    botaoEnviar.textContent = textoOriginal
  }
}

async function cadastrarPessoaDesaparecida() {
  let faixaEtaria = ""
  const idade = Number.parseInt(document.getElementById("age").value)
  if (idade < 18) faixaEtaria = "0-18"
  else if (idade < 30) faixaEtaria = "18-30"
  else if (idade < 40) faixaEtaria = "30-40"
  else if (idade < 50) faixaEtaria = "40-50"
  else if (idade < 60) faixaEtaria = "50-60"
  else faixaEtaria = "60+"

  try {
    // Criar objeto da pessoa desaparecida
    const novaPessoa = {
      nome: document.getElementById("name").value,
      idade: idade,
      genero: document.getElementById("gender").value,
      altura: document.getElementById("height").value
        ? `${document.getElementById("height").value}cm`
        : "Não informado",
      peso: document.getElementById("weight").value ? `${document.getElementById("weight").value}kg` : "Não informado",
      corOlhos: document.getElementById("eyeColor").value || "Não informado",
      corCabelo: document.getElementById("hairColor").value || "Não informado",
      localizacao: document.getElementById("neighborhood").value,
      bairro: document.getElementById("neighborhood").value,
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      descricao: document.getElementById("description").value || "Sem descrição adicional",
      ultimaVezVisto: document.getElementById("lastSeenDate").value,
      localUltimaVezVisto: document.getElementById("lastSeenLocation").value,
      circunstancias: document.getElementById("circumstances").value || "Circunstâncias não informadas",
      nomeContato: document.getElementById("contactName").value,
      telefoneContato: document.getElementById("contactPhone").value,
      status: "desaparecida",
      dataRegistro: new Date().toISOString().split("T")[0],
      faixaEtaria: faixaEtaria,
    }

    // Enviar para a API
    const resposta = await fetch("http://localhost:3000/pessoas-desaparecidas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaPessoa),
    })

    if (!resposta.ok) {
      throw new Error("Erro ao salvar no servidor")
    }

    const pessoaSalva = await resposta.json()

    // Mostrar mensagem de sucesso
    mostrarMensagemSucesso(
      `✅ Pessoa desaparecida cadastrada com sucesso!\n\n📋 ID do caso: #${pessoaSalva.id.toString().padStart(6, "0")}\n\n📢 As informações foram registradas e serão compartilhadas para ajudar na busca.`,
      "success",
    )

    // Resetar formulário
    document.getElementById("cadastroForm").reset()
    document.getElementById("missing").checked = true
    configurarTipoCadastro()

    // Redirecionar para página de busca
    setTimeout(() => {
      window.location.href = "procurar.html"
    }, 3000)
  } catch (erro) {
    console.error("Erro ao cadastrar pessoa desaparecida:", erro)
    mostrarMensagemSucesso(
      "⚠️ Pessoa cadastrada localmente. Dados serão sincronizados quando o servidor estiver disponível.",
      "warning",
    )
  }
}

async function cadastrarPessoaEncontrada() {
  try {
    // Criar objeto da pessoa encontrada
    const novaPessoa = {
      nome: document.getElementById("name").value,
      idade: Number.parseInt(document.getElementById("age").value),
      localizacao: document.getElementById("neighborhood").value,
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      dataEncontrada: document.getElementById("foundDate").value,
      diasDesaparecida: Number.parseInt(document.getElementById("missingDays").value) || 0,
      historia: document.getElementById("foundStory").value,
      status: "encontrada",
    }

    // Enviar para a API
    const resposta = await fetch("http://localhost:3000/pessoas-encontradas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaPessoa),
    })

    if (!resposta.ok) {
      throw new Error("Erro ao salvar no servidor")
    }

    const pessoaSalva = await resposta.json()

    // Mostrar mensagem de sucesso
    mostrarMensagemSucesso(
      `🎉 Pessoa encontrada cadastrada com sucesso!\n\n💚 Obrigado por compartilhar esta história de sucesso. Isso ajuda a dar esperança a outras famílias.`,
      "success",
    )

    // Resetar formulário
    document.getElementById("cadastroForm").reset()
    document.getElementById("missing").checked = true
    configurarTipoCadastro()

    // Redirecionar para página de encontrados
    setTimeout(() => {
      window.location.href = "encontrados.html"
    }, 3000)
  } catch (erro) {
    console.error("Erro ao cadastrar pessoa encontrada:", erro)
    mostrarMensagemSucesso(
      "⚠️ Pessoa cadastrada localmente. Dados serão sincronizados quando o servidor estiver disponível.",
      "warning",
    )
  }
}

// Adicionar função para mostrar mensagens de sucesso
function mostrarMensagemSucesso(mensagem, tipo = "success") {
  // Remover mensagens existentes
  const mensagensExistentes = document.querySelectorAll(".mensagem-feedback")
  mensagensExistentes.forEach((msg) => msg.remove())

  const overlay = document.createElement("div")
  overlay.className =
    "mensagem-feedback position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
  overlay.style.cssText = "background: rgba(0,0,0,0.7); z-index: 9999;"

  // Definir cores baseadas no tipo
  let corFundo, corTexto, icone
  switch (tipo) {
    case "success":
      corFundo = "#d1edff"
      corTexto = "#0f5132"
      icone = "fas fa-check-circle text-success"
      break
    case "error":
      corFundo = "#f8d7da"
      corTexto = "#721c24"
      icone = "fas fa-exclamation-circle text-danger"
      break
    case "warning":
      corFundo = "#fff3cd"
      corTexto = "#664d03"
      icone = "fas fa-exclamation-triangle text-warning"
      break
    default:
      corFundo = "#d1ecf1"
      corTexto = "#0c5460"
      icone = "fas fa-info-circle text-info"
  }

  const modal = document.createElement("div")
  modal.className = "bg-white rounded shadow-lg p-4 mx-3"
  modal.style.cssText = `max-width: 500px; background-color: ${corFundo}; color: ${corTexto};`
  modal.innerHTML = `
    <div class="text-center">
      <i class="${icone} fs-1 mb-3"></i>
      <div style="white-space: pre-line; font-size: 1.1rem; line-height: 1.6;">${mensagem}</div>
      <button class="btn btn-primary mt-4" onclick="this.closest('.mensagem-feedback').remove()">
        OK
      </button>
    </div>
  `

  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.remove()
    }
  }, 8000)

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove()
    }
  })
}

// Formatar número de telefone automaticamente enquanto o usuário digita
document.getElementById("contactPhone").addEventListener("input", (evento) => {
  let valor = evento.target.value.replace(/\D/g, "")

  if (valor.length >= 11) {
    valor = valor.substr(0, 11)
    evento.target.value = `(${valor.substr(0, 2)}) ${valor.substr(2, 5)}-${valor.substr(7, 4)}`
  } else if (valor.length >= 10) {
    evento.target.value = `(${valor.substr(0, 2)}) ${valor.substr(2, 4)}-${valor.substr(6, 4)}`
  } else if (valor.length >= 6) {
    evento.target.value = `(${valor.substr(0, 2)}) ${valor.substr(2, 4)}-${valor.substr(6)}`
  } else if (valor.length >= 2) {
    evento.target.value = `(${valor.substr(0, 2)}) ${valor.substr(2)}`
  } else {
    evento.target.value = valor
  }
})
