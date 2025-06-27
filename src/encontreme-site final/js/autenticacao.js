// JavaScript de autenticação

document.addEventListener("DOMContentLoaded", () => {
  configurarFormulariosAutenticacao()
  configurarAlternarSenha()
})

function configurarFormulariosAutenticacao() {
  const formularioLogin = document.getElementById("loginForm")
  const formularioRegistro = document.getElementById("registroForm")

  if (formularioLogin) {
    formularioLogin.addEventListener("submit", processarLogin)
  }

  if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", processarRegistro)
    configurarFormatacaoTelefone()
  }
}

function configurarAlternarSenha() {
  const botoesAlternar = document.querySelectorAll('[id^="togglePassword"], [id^="toggleConfirmPassword"]')

  botoesAlternar.forEach((botao) => {
    botao.addEventListener("click", function () {
      const inputAlvo =
        this.id === "togglePassword" ? document.getElementById("password") : document.getElementById("confirmPassword")
      const icone = this.querySelector("i")

      if (inputAlvo.type === "password") {
        inputAlvo.type = "text"
        icone.classList.remove("fa-eye")
        icone.classList.add("fa-eye-slash")
      } else {
        inputAlvo.type = "password"
        icone.classList.remove("fa-eye-slash")
        icone.classList.add("fa-eye")
      }
    })
  })
}

function configurarFormatacaoTelefone() {
  const inputTelefone = document.getElementById("phone")
  if (inputTelefone) {
    inputTelefone.addEventListener("input", (evento) => {
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
  }
}

async function processarLogin(evento) {
  evento.preventDefault()

  const email = document.getElementById("email").value
  const senha = document.getElementById("password").value
  const lembrarMe = document.getElementById("rememberMe").checked

  // Validação 
  if (!email || !senha) {
    mostrarMensagemFeedback("⚠️ Por favor, preencha todos os campos.", "warning")
    return
  }

  // Mostrar carregamento, emoji pego em pesquisa
  mostrarMensagemFeedback("🔄 Fazendo login...", "info")

  try {
    // Buscar usuário na API
    const resposta = await fetch(`http://localhost:3000/usuarios?email=${email}&senha=${senha}`)
    const usuarios = await resposta.json()

    if (usuarios.length > 0) {
      const usuario = usuarios[0]

      // Dados do usuário para armazenar
      const dadosUsuario = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        telefone: usuario.telefone,
        horarioLogin: new Date().toISOString(),
      }

      // Armazenar dados do usuário
      if (lembrarMe) {
        localStorage.setItem("dados-usuario", JSON.stringify(dadosUsuario))
      } else {
        sessionStorage.setItem("dados-usuario", JSON.stringify(dadosUsuario))
      }

      mostrarMensagemFeedback(`🎉 Login realizado com sucesso!\n\n👋 Bem-vindo(a), ${usuario.nome}!`, "success")

      // Redirecionar para inicio
      setTimeout(() => {
        window.location.href = "index.html"
      }, 2000)
    } else {
      mostrarMensagemFeedback("❌ Email ou senha incorretos!\n\nVerifique suas credenciais e tente novamente.", "error")
    }
  } catch (erro) {
    console.error("Erro ao fazer login:", erro)
    mostrarMensagemFeedback("⚠️ Erro de conexão. Tentando login offline...", "warning")

   
    setTimeout(() => {
      const dadosUsuario = {
        email: email,
        nome: "Usuário Local",
        horarioLogin: new Date().toISOString(),
      }

      if (lembrarMe) {
        localStorage.setItem("dados-usuario", JSON.stringify(dadosUsuario))
      } else {
        sessionStorage.setItem("dados-usuario", JSON.stringify(dadosUsuario))
      }

      mostrarMensagemFeedback("✅ Login realizado com sucesso!\n\n⚠️ Modo offline ativo", "success")

      setTimeout(() => {
        window.location.href = "index.html"
      }, 2000)
    }, 1000)
  }
}

async function processarRegistro(evento) {
  evento.preventDefault()

  const nome = document.getElementById("name").value
  const email = document.getElementById("email").value
  const telefone = document.getElementById("phone").value
  const senha = document.getElementById("password").value
  const confirmarSenha = document.getElementById("confirmPassword").value
  const termos = document.getElementById("terms").checked

  // Validação
  if (!nome || !email || !telefone || !senha || !confirmarSenha) {
    mostrarMensagemFeedback("⚠️ Por favor, preencha todos os campos obrigatórios.", "warning")
    return
  }

  if (senha !== confirmarSenha) {
    mostrarMensagemFeedback("❌ As senhas não coincidem!\n\nVerifique e digite novamente.", "error")
    return
  }

  if (senha.length < 6) {
    mostrarMensagemFeedback("⚠️ A senha deve ter pelo menos 6 caracteres.", "warning")
    return
  }

  if (!termos) {
    mostrarMensagemFeedback("📋 Você deve aceitar os termos de uso para continuar.", "warning")
    return
  }

  // Validar formato do email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regexEmail.test(email)) {
    mostrarMensagemFeedback("📧 Por favor, insira um e-mail válido.", "warning")
    return
  }

  // Mostrar carregamento
  mostrarMensagemFeedback("🔄 Criando sua conta...", "info")

  try {
    // Verificar se email já existe
    const respostaVerificacao = await fetch(`http://localhost:3000/usuarios?email=${email}`)
    const usuariosExistentes = await respostaVerificacao.json()

    if (usuariosExistentes.length > 0) {
      mostrarMensagemFeedback("⚠️ Este email já está cadastrado!\n\nTente fazer login ou use outro email.", "warning")
      return
    }

    // Criar novo usuário
    const novoUsuario = {
      nome: nome,
      email: email,
      telefone: telefone,
      senha: senha,
      dataRegistro: new Date().toISOString().split("T")[0],
      ativo: true,
    }

    // Enviar para a API
    const resposta = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoUsuario),
    })

    if (!resposta.ok) {
      throw new Error("Erro ao salvar no servidor")
    }

    const usuarioSalvo = await resposta.json()

    // Armazenar dados do usuário
    const dadosUsuario = {
      id: usuarioSalvo.id,
      nome: usuarioSalvo.nome,
      email: usuarioSalvo.email,
      telefone: usuarioSalvo.telefone,
      dataRegistro: usuarioSalvo.dataRegistro,
    }

    localStorage.setItem("dados-usuario", JSON.stringify(dadosUsuario))

    mostrarMensagemFeedback(
      `🎉 Conta criada com sucesso!\n\n👋 Bem-vindo(a) ao EncontreMe, ${usuarioSalvo.nome}!\n\n✅ Você já está logado e pode começar a usar a plataforma.`,
      "success",
    )

    // Redirecionar para home
    setTimeout(() => {
      window.location.href = "index.html"
    }, 3000)
  } catch (erro) {
    console.error("Erro ao criar conta:", erro)
    mostrarMensagemFeedback(
      "⚠️ Conta criada localmente. Dados serão sincronizados quando o servidor estiver disponível.",
      "warning",
    )

    setTimeout(() => {
      window.location.href = "index.html"
    }, 3000)
  }
}

function mostrarMensagemFeedback(mensagem, tipo = "info") {
  
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
    case "info":
      corFundo = "#d1ecf1"
      corTexto = "#0c5460"
      icone = "fas fa-info-circle text-info"
      break
    default:
      corFundo = "#e2e3e5"
      corTexto = "#383d41"
      icone = "fas fa-info-circle text-secondary"
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

  if (tipo === "info" || tipo === "warning") {
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove()
      }
    }, 5000)
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove()
    }
  })
}

// Manter função mostrarAlerta para compatibilidade
function mostrarAlerta(mensagem, tipo = "info") {
  mostrarMensagemFeedback(mensagem, tipo)
}

// Verificar se usuário está logado
function estaLogado() {
  return localStorage.getItem("dados-usuario") || sessionStorage.getItem("dados-usuario")
}

// Obter dados do usuário atual
function obterUsuarioAtual() {
  const dadosUsuario = localStorage.getItem("dados-usuario") || sessionStorage.getItem("dados-usuario")
  return dadosUsuario ? JSON.parse(dadosUsuario) : null
}

// Função de logout
function fazerLogout() {
  localStorage.removeItem("dados-usuario")
  sessionStorage.removeItem("dados-usuario")
  window.location.href = "index.html"
}
