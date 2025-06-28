# Plano de testes de software

<span style="color:red">Pré-requisitos: <a href="03-Product-design.md"> Especificação do projeto</a></span>, <a href="05-Projeto-interface.md"> Projeto de interface</a>

O plano de testes de software é gerado a partir da especificação do sistema e consiste em casos de teste que deverão ser executados quando a implementação estiver parcial ou totalmente pronta. Apresente os cenários de teste utilizados na realização dos testes da sua aplicação. Escolha cenários de teste que demonstrem os requisitos sendo satisfeitos.

Enumere quais cenários de testes foram selecionados para teste. Neste tópico, o grupo deve detalhar quais funcionalidades foram avaliadas, o grupo de usuários que foi escolhido para participar do teste e as ferramentas utilizadas.

Não deixe de enumerar os casos de teste de forma sequencial e garantir que o(s) requisito(s) associado(s) a cada um deles esteja(m) correto(s) — de acordo com o que foi definido na <a href="03-Product-design.md">Especificação do projeto</a>.

Por exemplo:

| **Caso de teste**  | **CT-001 – Cadastrar pessoa desaparecida**  |
|:---: |:---: |
| Requisito associado | RF-001 - O sistema deve permitir o cadastro de pessoas desaparecidas com informações detalhadas. |
| Objetivo do teste | Verificar se o usuário consegue cadastrar uma pessoa desaparecida com todas as informações necessárias. |
| Passos | - Acessar a página de cadastro <br> - Selecionar "Pessoa Desaparecida" <br> - Preencher os campos obrigatórios (nome, idade, gênero) <br> - Adicionar foto <br> - Preencher informações do desaparecimento (data, local) <br> - Inserir informações de contato <br> - Clicar em "Cadastrar Pessoa" |
| Critério de êxito | - O cadastro foi realizado com sucesso e os dados são exibidos corretamente. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

<br>

| **Caso de teste**  | **CT-002 – Pesquisar pessoas desaparecidas**  |
|:---: |:---: |
| Requisito associado | RF-002 - O sistema deve permitir a busca de pessoas desaparecidas com filtros. |
| Objetivo do teste | Verificar se o usuário consegue buscar pessoas desaparecidas utilizando filtros. |
| Passos | - Acessar a página de pesquisa <br> - Inserir um termo de busca <br> - Aplicar filtros (gênero, faixa etária, bairro) <br> - Clicar em "Buscar"|
| Critério de êxito | - Os resultados são exibidos corretamente de acordo com os filtros aplicados. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

<br>

| **Caso de teste**  | **CT-003 – Registrar pessoa encontrada**  |
|:---: |:---: |
| Requisito associado | RF-003 - O sistema deve permitir o registro de pessoas encontradas. |
| Objetivo do teste | Verificar se o usuário consegue registrar uma pessoa que foi encontrada. |
| Passos | - Acessar a página de cadastro <br> - Selecionar "Pessoa Encontrada" <br> - - Preencher os campos obrigatórios <br> - Adicionar informações sobre como foi encontrada <br> - Clicar em "Cadastrar Pessoa"|
| Critério de êxito | - O registro foi realizado com sucesso e a pessoa aparece na lista de encontrados. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

<br>

| **Caso de teste**  | **CT-004 – Visualizar casos resolvidos**  |
|:---: |:---: |
| Requisito associado | RF-004 - O sistema deve exibir estatísticas e históricos de casos resolvidos. |
| Objetivo do teste | Verificar se o usuário consegue visualizar os casos resolvidos e suas estatísticas. |
| Passos | - Acessar a página de casos resolvidos <br> - Verificar a lista de casos <br> - - Aplicar filtros <br> - Verificar as estatísticas exibidas|
| Critério de êxito | - Os casos são exibidos corretamente e as estatísticas são calculadas adequadamente. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

<br>

| **Caso de teste**  | **CT-005 – Realizar login**  |
|:---: |:---: |
| Requisito associado | RF-005 - O sistema deve permitir o login de usuários cadastrados. |
| Objetivo do teste | Verificar se o usuário consegue realizar login no sistema. |
| Passos | - Acessar a página de login <br> - Inserir e-mail e senha válidos <br> - Clicar em "Entrar"|
| Critério de êxito | - O login é realizado com sucesso e o usuário é redirecionado para a página inicial. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

<br>

| **Caso de teste**  | **CT-006 – Criar conta de usuário**  |
|:---: |:---: |
| Requisito associado | RF-006 - O sistema deve permitir o cadastro de novos usuários. |
| Objetivo do teste | Verificar se o usuário consegue criar uma nova conta no sistema. |
| Passos | - Acessar a página de registro <br> - Preencher os campos obrigatórios (nome, e-mail, telefone, senha) <br> - Aceitar os termos de uso <br> - Clicar em "Criar Conta"|
| Critério de êxito | - A conta é criada com sucesso e o usuário pode realizar login. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |


## Ferramentas de testes (opcional)

Comente sobre as ferramentas de testes utilizadas.
 

