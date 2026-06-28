# Solidarity Management System

Plataforma de gestão de doações, beneficiários (famílias), estoque e distribuição de donativos voltada para organizações beneficentes e de solidariedade social.

Este repositório possui uma arquitetura dividida e desacoplada, separando completamente a interface do usuário (Frontend) da lógica de negócios e persistência de dados (Backend).

---

## Estrutura e Divisão do Projeto

O projeto é dividido em dois diretórios principais:

1. **`APISolidarityManager` (Backend)**: 
   - Web API construída em **ASP.NET Core (.NET 9.0)**.
   - Utiliza **Entity Framework Core 9** como ORM.
   - Possui suporte dinâmico a múltiplos provedores de banco de dados (**SQL Server** ou **MySQL**), alternáveis via configuração.
   - Lógica de cálculo de prioridades sociais, controle de regras de necessidade e sugestão inteligente de cestas/kits de doações baseadas no estoque e composição familiar.

2. **`donation-system-web` (Frontend)**:
   - Aplicação web moderna desenvolvida em **React 19** com **TypeScript** e **Vite**.
   - Interface estilizada com **Bootstrap** e **React Bootstrap**.
   - Painéis visuais para acompanhamento de dados com **Recharts**.
   - Integração com a API via **Axios**.

---

## Pré-requisitos

Para rodar a aplicação localmente, você precisará ter instalado em sua máquina:

- **Node.js** (versão 18.x ou superior) e **npm**.
- **.NET 9.0 SDK** (para o backend).
- **Visual Studio 2022** (com a carga de trabalho *Desenvolvimento Web e ASP.NET* habilitada) ou **JetBrains Rider** / **VS Code**.
- **Docker Desktop** (para execução dos bancos de dados).
- **EF Core CLI** (caso queira rodar migrations via prompt de comando):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

## Configuração do Banco de Dados (Docker)

O sistema suporta tanto o **SQL Server** quanto o **MySQL**. Você pode rodar qualquer um deles facilmente via Docker com os comandos abaixo (configurados com as senhas padrão definidas no projeto):

### Opção A: Executar SQL Server no Docker
Execute o seguinte comando no terminal para subir o container do SQL Server:
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Senha123" -p 1433:1433 --name solidarity-sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

### Opção B: Executar MySQL no Docker
Execute o seguinte comando no terminal para subir o container do MySQL:
```bash
docker run --name solidarity-mysql -e MYSQL_ROOT_PASSWORD=Senha123 -e MYSQL_DATABASE=solidarity_management_mysql -p 3306:3306 -d mysql:latest
```

---

## Configurando e Inicializando o Backend

### 1. Definindo o Provedor no Backend
No arquivo [appsettings.json](file:///C:/Repositories/tcc/APISolidarityManager/APISolidarityManager/appsettings.json), localize a chave `"DatabaseProvider"`. Defina-a conforme o banco que você subiu no Docker:

- Para usar SQL Server:
  ```json
  "DatabaseProvider": "SqlServer"
  ```
- Para usar MySQL:
  ```json
  "DatabaseProvider": "MySql"
  ```

As strings de conexão prontas com as credenciais padrão do Docker estão configuradas em `"ConnectionStrings"`.

### 2. Rodando as Migrations para Criar o Banco
Com o container do banco ativo e a configuração ajustada no `appsettings.json`, você precisa aplicar as Migrations para criar as tabelas do banco de dados.

#### Via Visual Studio (Recomendado):
1. Abra a solução `APISolidarityManager.sln` no Visual Studio.
2. Abra o **Console do Gerenciador de Pacotes** (`Ferramentas` > `Gerenciador de Pacotes do NuGet` > `Console do Gerenciador de Pacotes`).
3. Certifique-se de que o *Projeto padrão* está selecionado como `APISolidarityManager` (o projeto interno).
4. Execute o comando:
   ```powershell
   Update-Database
   ```

#### Via Linha de Comando (CLI):
Navegue até a pasta interna do projeto e execute:
```bash
cd APISolidarityManager/APISolidarityManager
dotnet ef database update
```

### 3. Rodando o Backend pelo Visual Studio
1. Com a solução `APISolidarityManager.sln` aberta no Visual Studio, defina o projeto `APISolidarityManager` como projeto de inicialização.
2. Execute a aplicação (pressione **F5** ou **Ctrl + F5**).
3. A API rodará sob os endereços:
   - **HTTPS**: `https://localhost:7251` (padrão consumido pelo frontend)
   - **HTTP**: `http://localhost:5210`
4. A interface do **Swagger** abrirá automaticamente no navegador em `https://localhost:7251/swagger`, permitindo visualizar e testar todos os endpoints disponíveis.

---

## Configurando e Rodando o Frontend

O frontend está configurado para consumir o backend na porta `7251` (`https://localhost:7251`).

1. Abra o terminal na pasta do frontend:
   ```bash
   cd donation-system-web
   ```
2. Instale todas as dependências necessárias com:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento utilizando o Vite:
   ```bash
   npm run dev
   ```
4. O terminal exibirá a URL local gerada (geralmente `http://localhost:5173`). Abra essa URL no seu navegador para utilizar o sistema.
5. Para compilar o projeto para produção:
   ```bash
   npm run build
   ```

---

## Regras de Negócio e Funcionalidades Principais

Este sistema conta com mecanismos inteligentes para otimizar o atendimento social das famílias cadastradas:

### 1. Cálculo Automático de Prioridade Social
O sistema calcula um score de prioridade social baseado em critérios de vulnerabilidade para ranquear as famílias que necessitam de doações com mais urgência:
- **Base cadastral ativa**: +5 pontos.
- **Composição familiar**: +1 ponto por membro ativo (máximo de 6).
- **Membros especiais**:
  - Criança com menos de 2 anos: +5 pontos (e marcação para análise manual).
  - Criança entre 2 e 12 anos: +3 pontos.
  - Idoso (>= 60 anos): +4 pontos.
  - Portador de deficiência física/mental: +5 pontos.
  - Portador de doença crônica: +4 pontos.
- **Renda per capita**: Renda familiar per capita menor ou igual a R$ 218 adiciona +10 pontos.
- **Histórico de entregas**:
  - Família que nunca recebeu entrega antes: **+100 pontos** (Classificada como prioridade Urgente).
  - Sem receber entrega há mais de 90 dias: +60 pontos.
  - Sem receber entrega há mais de 60 dias: +40 pontos.
  - Sem receber entrega há mais de 30 dias: +20 pontos.
- **Níveis de Classificação**:
  - `>= 100`: Urgente
  - `>= 60`: Alta
  - `>= 30`: Média
  - `< 30`: Baixa

### 2. Algoritmo de Sugestão Inteligente de Entrega
Ao sugerir uma doação para uma determinada família, a API analisa:
1. **Necessidade do Membro**: Cruza a idade de cada membro da família com regras de necessidade de cada grupo de itens (por exemplo: quantidade necessária de litros de leite, pacotes de fralda ou cestas básicas conforme a idade).
2. **Estoque e Validade**: Varre o estoque e seleciona os lotes dos produtos correspondentes.
3. **PEPS / Validade mais Curta**: Prioriza itens com data de validade mais próxima (janela crítica de 15 dias) para evitar desperdício no estoque.
4. **Variedade**: O algoritmo tenta mesclar itens diferentes de uma mesma categoria mantendo o estoque diversificado e atendendo à risca as quantidades recomendadas de forma equilibrada.

---

## ⚡ Principais Tecnologias do Ecossistema

- **Linguagem Principal**: C# (.NET 9) & TypeScript (React 19)
- **Banco de Dados**: Entity Framework Core 9 (SQL Server / MySQL)
- **Design de Telas**: Bootstrap 5, React-Bootstrap, React Icons
- **Gráficos**: Recharts
- **Documentação de API**: Swagger (OpenAPI 3.0)
- **Controle de Formulários**: React Hook Form
- **Notificações**: React Toastify
