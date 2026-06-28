# Solidarity Management System

Plataforma integrada de gestão logística humanitária, triagem demográfica e inteligência distributiva projetada para otimizar o fluxo de doações e o atendimento de famílias em situação de vulnerabilidade social.

O sistema possui uma arquitetura completamente desacoplada, separando a interface do usuário (Frontend) da camada de persistência e regras de negócio complexas (Backend).

---

## Estrutura e Divisão do Projeto

O ecossistema é dividido em dois repositórios/diretórios principais:

1. **`APISolidarityManager` (Backend)**:
* Web API assíncrona construída sobre a plataforma **.NET 9.0 (C#)**.
* Camada de persistência gerenciada pelo **Entity Framework Core 9** utilizando o padrão de projeto *Repository*.
* Suporte dinâmico e desacoplado a múltiplos provedores de banco de dados (**SQL Server** ou **MySQL**), alternáveis via arquivo de configuração.
* Núcleo analítico responsável pelo processamento do sistema de pontuação acumulada (*Scoring System*) para ranqueamento familiar e execução do motor de decisão distributiva.


2. **`donation-system-web` (Frontend)**:
* Aplicação SPA moderna desenvolvida em **React 19**, **TypeScript** e **Vite**.
* Organizada sob o padrão de arquitetura modular por funcionalidades (*Feature-Based Architecture*).
* Componentização visual fluida com **Bootstrap 5** e **React Bootstrap**.
* Painéis analíticos e gráficos interativos orientados a dados utilizando a biblioteca **Recharts**.
* Comunicação assíncrona com os endpoints da API via **Axios**.



---

## Pré-requisitos

Para clonar e executar este projeto localmente, você precisará de:

* **Node.js** (versão 18.x ou superior) e gerenciador de pacotes **npm**.
* **.NET 9.0 SDK** instalado.
* IDE de preferência: **Visual Studio 2022** (com a carga de trabalho *Desenvolvimento Web e ASP.NET*), **JetBrains Rider** ou **VS Code**.
* **Docker Desktop** ativo (para inicialização rápida dos servidores de banco de dados).
* Ferramenta de CLI do Entity Framework Core globalizada:
```bash
dotnet tool install --global dotnet-ef

```



---

## Configuração do Banco de Dados via Docker

A plataforma está parametrizada para se conectar a instâncias conteinerizadas. Escolha o banco de sua preferência e execute o comando correspondente no terminal para subir o container com as credenciais padrão do projeto:

### Opção A: Executar Microsoft SQL Server

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Senha123" -p 1433:1433 --name solidarity-sqlserver -d mcr.microsoft.com/mssql/server:2022-latest

```

### Opção B: Executar MySQL

```bash
docker run --name solidarity-mysql -e MYSQL_ROOT_PASSWORD=Senha123 -e MYSQL_DATABASE=solidarity_management_mysql -p 3306:3306 -d mysql:latest

```

---

## Configurando e Inicializando o Backend

### 1. Parametrizando o Provedor de Dados

No arquivo `appsettings.json` do projeto principal, localize a chave `"DatabaseProvider"` e defina qual banco a aplicação deve gerenciar:

* Para instâncias do SQL Server:
```json
"DatabaseProvider": "SqlServer"

```


* Para instâncias do MySQL:
```json
"DatabaseProvider": "MySql"

```



As strings de conexão estruturadas (`ConnectionStrings`) já apontam por padrão para as portas locais mapeadas nos comandos do Docker acima.

### 2. Executando as Migrations para Estruturação do Schema

Com o container escolhido ativo, execute a atualização das tabelas.

#### Via Console do Gerenciador de Pacotes (Visual Studio):

1. Defina o projeto padrão do console como `APISolidarityManager`.
2. Execute o comando:
```powershell
Update-Database

```



#### Via CLI do .NET (Terminal):

Navegue até o diretório raiz do projeto de código do backend e execute:

```bash
cd APISolidarityManager/APISolidarityManager
dotnet ef database update

```

> **Nota sobre Massa de Dados:** O projeto acompanha scripts SQL de sementes (*seed data*) para popular tabelas como `age_ranges`, `need_rules`, `item_templates`, e lotes históricos de doações automáticas. Eles garantem dados volumosos para testar o comportamento do dashboard e os cenários de teste da fila de prioridades imediatamente após as migrations.

### 3. Execução da API

1. Defina o projeto `APISolidarityManager` como o projeto de inicialização na sua IDE.
2. Execute o ambiente de desenvolvimento (**F5** ou **Ctrl + F5**).
3. A API escutará as requisições sob as portas:
* **HTTPS**: `https://localhost:7251` *(URL padrão integrada ao arquivo de ambiente do Frontend)*
* **HTTP**: `http://localhost:5210`


4. A documentação interativa dos endpoints via **Swagger (OpenAPI 3.0)** será aberta automaticamente no endereço `https://localhost:7251/swagger`.

---

## Configurando e Inicializando o Frontend

A interface do usuário consome nativamente a porta segura de desenvolvimento do backend (`https://localhost:7251`).

1. Mude para a pasta do projeto web:
```bash
cd donation-system-web

```


2. Realize a restauração e instalação dos pacotes do ecossistema Node:
```bash
npm install

```


3. Inicie o servidor local empacotado pelo Vite:
```bash
npm run dev

```


4. Acesse o endereço disponibilizado no terminal (geralmente `http://localhost:5173`) para interagir com a interface gráfica da plataforma.
5. Para gerar o build otimizado para ambiente de produção:
```bash
npm run build

```



---

## Regras de Negócio e Lógica Analítica Principal

O grande diferencial técnico do projeto reside na automatização inteligente do fluxo de triagem e escoamento, eliminando a carga operacional humana através de duas arquiteturas de algoritmo centrais:

### 1. Ranqueamento pelo Sistema de Pontuação Acumulada (*Scoring System*)

Para definir quais famílias se encontram em maior estado de vulnerabilidade e devem encabeçar a fila de atendimento, o sistema avalia e pondera os seguintes marcadores demográficos e temporais:

* **Vínculo Cadastral:** Cadastro ativo na base institucional confere base fixa de `+5 pontos`.
* **Densidade Familiar:** Adiciona `+1 ponto` por membro ativo integrante do núcleo familiar (com teto limitador de até 6 pontos).
* **Marcadores Especiais e Faixas Etárias:**
* Presença de membro com deficiência física ou mental (*has_disability*): `+5 pontos`.
* Presença de membro acometido por doença crônica (*has_chronic_disease*): `+4 pontos`.
* Dependente classificado como Lactante/Bebê (idade inferior a 2 anos): `+5 pontos` *(Aciona flag interna de triagem ou análise manual)*.
* Dependente classificado como Criança (idade entre 2 e 12 anos completos): `+3 pontos`.
* Integrante classificado como Idoso (idade igual ou superior a 60 anos): `+4 pontos`.


* **Linha de Pobreza e Renda:** Renda familiar *per capita* igual ou inferior à linha de corte de R$ 218,00 confere automaticamente `+10 pontos`.
* **Histórico e Janela Temporal de Atendimentos:**
* Família recém-cadastrada que **nunca recebeu doações na instituição**: Ganha bonificação de **`+100 pontos`**, sendo classificada imediatamente no topo da fila em estado de urgência.
* Ausência de recebimento de suprimentos há mais de 90 dias: `+60 pontos`.
* Ausência de recebimento de suprimentos há mais de 60 dias: `+40 pontos`.
* Ausência de recebimento de suprimentos há mais de 30 dias: `+20 pontos`.



**Classificação dos Níveis de Atendimento:**

* **Score $\ge$ 100:** Urgente
* **Score $\ge$ 60:** Alta
* **Score $\ge$ 30:** Média
* **Score $<$ 30:** Baixa

### 2. Motor Logístico de Distribuição Inteligente (Heurística Multicritério FEFO)

A geração automática de propostas de cestas e kits de insumos não é estática. Quando uma família é selecionada para atendimento, o algoritmo processa uma heurística gulosa multicritério baseada nas seguintes diretrizes logísticas:

1. **Determinação da Demanda Teórica:** O sistema varre as regras de necessidade (`need_rules`) de cada membro daquela família com base nas suas idades, gerando uma meta de volume ideal (ex: somando a necessidade de carboidratos, proteínas, higiene infantil, etc.).
2. **Mapeamento por Peso Equivalente (`template_weight`):** O algoritmo traduz itens físicos comerciais para a unidade conceitual base do catálogo (ex: uma pasta de dente de $90\text{ g}$ é processada matematicamente como peso `0,1` em relação ao modelo base de $1\text{ kg}$), permitindo o cálculo exato e homogêneo de atendimento da meta familiar.
3. **Ordenação Crítica por Validade (Critério FEFO - *First Expired, First Out*):** O motor busca no estoque os lotes disponíveis (`inventory_batches`) dos itens recomendados e ordena as saídas priorizando estritamente os lotes com datas de validade mais próximas do vencimento (com foco especial em janelas críticas inferiores a 15 dias).
4. **Mitigação de Desperdício e Variedade:** Caso o estoque mestre de um item específico esteja escasso ou indisponível, o motor realiza substituições inteligentes por itens de marcas ou variações distintas mantendo a conformidade nutricional e a categoria física exigida, otimizando o escoamento global do almoxarifado.

---

## Tecnologias Utilizadas no Ecossistema

* **Back-end Core:** .NET 9.0, ASP.NET Web API, C# 13.
* **ORM & Data Acess:** Entity Framework Core 9 (Provedores SQL Server e MySQL).
* **Front-end SPA:** React 19, TypeScript, Vite.
* **Data Visualization & Analytics:** Recharts.
* **UI & Layout components:** Bootstrap 5, React-Bootstrap, React Icons.
* **Form Management & Validation:** React Hook Form.
* **API Client:** Axios.
* **Real-time Notifications:** React Toastify.
* **API Documentation:** Swagger UI / OpenAPI 3.0.
