# EncontreMe - Sistema de Busca de Pessoas

## 🚀 Como executar o projeto

### 1. Instalar dependências
\`\`\`bash
npm install
\`\`\`

### 2. Iniciar o servidor da API
\`\`\`bash
npm start
\`\`\`

### 3. Acessar a aplicação
Abra o arquivo `index.html` em um navegador web.

## 📡 Endpoints da API

Com o servidor rodando em `http://localhost:3000`, os seguintes endpoints estarão disponíveis:

- **GET** `/pessoas-desaparecidas` - Lista todas as pessoas desaparecidas
- **GET** `/pessoas-desaparecidas/:id` - Busca pessoa desaparecida por ID
- **POST** `/pessoas-desaparecidas` - Cadastra nova pessoa desaparecida

- **GET** `/pessoas-encontradas` - Lista todas as pessoas encontradas
- **GET** `/pessoas-encontradas/:id` - Busca pessoa encontrada por ID
- **POST** `/pessoas-encontradas` - Cadastra nova pessoa encontrada

- **GET** `/casos-resolvidos` - Lista todos os casos resolvidos
- **GET** `/casos-resolvidos/:id` - Busca caso resolvido por ID
- **POST** `/casos-resolvidos` - Cadastra novo caso resolvido

## 🗂️ Estrutura dos Dados

### Pessoa Desaparecida
\`\`\`json
{
  "id": 1,
  "nome": "Nome da Pessoa",
  "idade": 30,
  "genero": "Masculino|Feminino",
  "altura": "1.75m",
  "peso": "70kg",
  "corOlhos": "Castanhos",
  "corCabelo": "Preto",
  "localizacao": "Centro",
  "bairro": "Centro",
  "foto": "url_da_foto",
  "descricao": "Descrição física detalhada",
  "ultimaVezVisto": "2024-01-15",
  "localUltimaVezVisto": "Local específico",
  "circunstancias": "Circunstâncias do desaparecimento",
  "nomeContato": "Nome do responsável",
  "telefoneContato": "(11) 99999-9999",
  "status": "desaparecida",
  "dataRegistro": "2024-01-16",
  "faixaEtaria": "30-40",
  "idCaso": "000001"
}
\`\`\`

### Pessoa Encontrada
\`\`\`json
{
  "id": 1,
  "nome": "Nome da Pessoa",
  "idade": 30,
  "localizacao": "Centro",
  "foto": "url_da_foto",
  "dataEncontrada": "2024-01-20",
  "diasDesaparecida": 5,
  "historia": "História de como foi encontrada",
  "status": "encontrada"
}
\`\`\`

### Caso Resolvido
\`\`\`json
{
  "id": 1,
  "nome": "Nome da Pessoa",
  "idade": 30,
  "localizacao": "Centro",
  "foto": "url_da_foto",
  "dataResolucao": "2024-01-25",
  "diasDesaparecida": 15,
  "resultado": "encontrado_seguro|retornou_casa",
  "descricao": "Descrição da resolução",
  "ano": 2024
}
\`\`\`

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend Mock**: JSON Server
- **Dados**: JSON
- **Ícones**: Font Awesome
- **Imagens**: Unsplash (placeholder)

## 📱 Funcionalidades

- ✅ Busca de pessoas desaparecidas
- ✅ Cadastro de pessoas desaparecidas
- ✅ Visualização de pessoas encontradas
- ✅ Histórico de casos resolvidos
- ✅ Filtros de busca avançados
- ✅ Interface responsiva
- ✅ Sistema de autenticação (mock)
- ✅ Compartilhamento de casos
- ✅ Contato de emergência

## 🌐 Estrutura do Projeto

\`\`\`
encontreme/
├── index.html              # Página inicial
├── procurar.html           # Busca de pessoas
├── cadastrar.html          # Cadastro de pessoas
├── encontrados.html        # Pessoas encontradas
├── casos-resolvidos.html   # Casos resolvidos
├── pessoa.html             # Detalhes da pessoa
├── login.html              # Login
├── registro.html           # Registro
├── sobre.html              # Sobre o projeto
├── css/
│   └── estilo.css          # Estilos principais
├── js/
│   ├── principal.js        # JavaScript principal
│   ├── procurar.js         # Funcionalidades de busca
│   ├── cadastrar.js        # Cadastro de pessoas
│   ├── encontrados.js      # Pessoas encontradas
│   ├── casos-resolvidos.js # Casos resolvidos
│   ├── pessoa.js           # Detalhes da pessoa
│   └── auth.js             # Autenticação
├── data/
│   └── db.json             # Base de dados
├── package.json            # Dependências do projeto
└── README.md               # Documentação
\`\`\`

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

- **Projeto**: EncontreMe
- **Email**: contato@encontreme.com
- **Emergência**: 190 (Polícia)

---

**EncontreMe** - Conectando famílias e ajudando a encontrar pessoas desaparecidas. 💙
