// Configuração da API
const API_CONFIG = {
  // Detectar se está em produção ou desenvolvimento
  baseURL:
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : window.location.origin,

  // Endpoints
  endpoints: {
    pessoasDesaparecidas: "/api/pessoas-desaparecidas",
    pessoasEncontradas: "/api/pessoas-encontradas",
    casosResolvidos: "/api/casos-resolvidos",
    usuarios: "/api/usuarios",
  },
}

// Função helper para fazer requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const finalOptions = { ...defaultOptions, ...options }

  try {
    const response = await fetch(url, finalOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro na API:", error)
    throw error
  }
}

// Exportar para uso global
window.API_CONFIG = API_CONFIG
window.apiRequest = apiRequest
