<div align="center">
    <h1>API Cardápio</h1>
    <h5 align="center">
        Uma API REST completa para gerenciamento de cardápios de restaurantes com Firebase Realtime Database.
    </h5>
    <p align="center">
        &middot;
        <a target="_blank" href="#endpoints">Documentação</a>
        &middot;
        <a target="_blank" href="#docker">Docker</a>
        &middot;
    </p>
</div>

## Sobre
<p>
  Esta API foi desenvolvida para facilitar o gerenciamento de cardápios de restaurantes, lanchonetes e estabelecimentos alimentícios. Com ela, você pode cadastrar, listar, editar e deletar produtos do seu cardápio de forma simples e eficiente.
</p>
<p>
  A API utiliza Firebase Realtime Database para armazenamento em tempo real, garantindo sincronização instantânea dos dados. Todos os preços são automaticamente formatados e arredondados para duas casas decimais, facilitando o controle financeiro.
</p>
<p>
  Ideal para integração com aplicativos mobile, sistemas web de delivery, totens de autoatendimento e qualquer sistema que precise gerenciar produtos alimentícios.
</p>  

## Feito com
* <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
* <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
* <img src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase"/>
* <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"/>
<br>

## Endpoints

A API possui os seguintes endpoints principais:

### 🍔 Cadastrar Produto
**POST** `/cardapio/cadastrar`

Cadastra um novo produto no cardápio.

**Body (JSON):**
```json
{
  "nome": "Hambúrguer Clássico",
  "preco": 25.90,
  "categoria": "hamburguers",
  "descricao": "Hambúrguer com carne, alface, tomate e queijo"
}
```

**Resposta de sucesso (201):**
```json
{
  "success": true,
  "message": "Produto cadastrado com sucesso",
  "data": {
    "id": "-Ow1NsvpAJAvADeOEezg",
    "nome": "Hambúrguer Clássico",
    "preco": 25.90,
    "categoria": "hamburguers",
    "descricao": "Hambúrguer com carne, alface, tomate e queijo",
    "disponivel": true,
    "criadoEm": "2025-07-25T15:33:36.250Z"
  }
}
```

### 📋 Listar Produtos
**GET** `/produtos`

Lista todos os produtos do cardápio.

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "-Ow1NsvpAJAvADeOEezg",
      "nome": "Hambúrguer Clássico",
      "preco": 25.90,
      "categoria": "hamburguers",
      "descricao": "Hambúrguer com carne, alface, tomate e queijo",
      "disponivel": true,
      "criadoEm": "2025-07-25T15:33:36.250Z"
    }
  ],
  "total": 1
}
```

### 🗑️ Deletar Produto
**DELETE** `/cardapio/deletar/:id`

Remove um produto do cardápio.

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "message": "Produto deletado com sucesso",
  "data": {
    "id": "-Ow1NsvpAJAvADeOEezg"
  }
}
```

**Resposta de erro (404):**
```json
{
  "success": false,
  "message": "Produto não encontrado",
  "id_fornecido": "id-inexistente"
}
```

### ✨ Informações da API
**GET** `/`

Retorna informações básicas da API e endpoints disponíveis.

**Resposta:**
```json
{
  "message": "API Cardápio funcionando!",
  "endpoints": {
    "POST /cardapio/cadastrar": "Cadastrar novo produto",
    "GET /produtos": "Listar produtos"
  }
}
```

## Validações

### 📝 Campos Obrigatórios
- **nome**: Mínimo 2 caracteres
- **preco**: Apenas números, aceita vírgula ou ponto como separador decimal
- **categoria**: Mínimo 2 caracteres

### 💰 Formatação de Preços
- Preços são automaticamente arredondados para 2 casas decimais
- `25.9344343` → `25.93`
- `25.999` → `26.00`
- Aceita tanto vírgula quanto ponto como separador decimal

### ❌ Tratamento de Erros
- **400**: Dados inválidos ou campos obrigatórios ausentes
- **404**: Produto não encontrado (ao deletar)
- **500**: Erro interno do servidor

## Utilização

### Configuração Local

Para executar a aplicação localmente, siga os passos abaixo:

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/api-cardapio.git
   cd api-cardapio
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas credenciais do Firebase
   ```

4. **Execute em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Ou execute a versão de produção**
   ```bash
   npm start
   ```

A aplicação estará disponível em `http://localhost:3000`.

### Configuração com Docker

#### Docker Simples
```bash
# Construir a imagem
docker build -t api-cardapio .

# Executar o container
docker run -p 3000:3000 --env-file .env api-cardapio
```

#### Docker Compose (Recomendado)
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Produção
docker-compose up --build

# Em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Realtime Database
3. Configure as regras de segurança (temporárias para desenvolvimento):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
4. Copie as credenciais para o arquivo `.env`

## Scripts Disponíveis

```bash
npm start          # Inicia a aplicação
npm run dev        # Modo desenvolvimento com nodemon
npm test           # Executa testes
npm run lint       # Verifica código com ESLint
npm run build      # Build para produção (se aplicável)
```

## Estrutura do Projeto

```
api-cardapio/
├── src/
│   ├── services/
│   │   └── produtoService.js
│   ├── firebase.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Exemplos de Uso

### cURL
```bash
# Cadastrar produto
curl -X POST http://localhost:3000/cardapio/cadastrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Pizza Margherita",
    "preco": "35,50",
    "categoria": "pizzas",
    "descricao": "Pizza tradicional italiana"
  }'

# Listar produtos
curl http://localhost:3000/produtos

# Deletar produto
curl -X DELETE http://localhost:3000/cardapio/deletar \
  -H "Content-Type: application/json" \
  -d '{"id": "ID_DO_PRODUTO"}'
```

### JavaScript/Fetch
```javascript
// Cadastrar produto
const response = await fetch('http://localhost:3000/cardapio/cadastrar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nome: 'Coca-Cola',
    preco: 5.50,
    categoria: 'bebidas',
    descricao: 'Refrigerante 350ml'
  })
});

const data = await response.json();
console.log(data);
```

## Contribuições
### Você pode contribuir com este código enviando um pull request. Basta seguir estas instruções:
<br>

1. Faça um fork desse repositório;
2. Crie uma nova branch com sua funcionalidade: (`git checkout -b feature/NovaFeature`);
3. Faça um commit das suas mudanças: (`git commit -m 'Adicionada NovaFeature`);
4. Realize um push para o repositório original: (`git push origin feature/NovaFeature`);
5. Crie um pull request.

<p>E está pronto, simples assim! 🎉</p>

## Roadmap

- [ ] ✏️ Endpoint para editar produtos
- [ ] 🔍 Busca por categoria
- [ ] 📊 Endpoint para estatísticas
- [ ] 🔐 Autenticação JWT
- [ ] 📱 Upload de imagens
- [ ] 💾 Cache com Redis
- [ ] 📚 Documentação Swagger

## Licença

Distribuído sob a Licença MIT. Consulte `LICENSE.txt` para mais informações.

## Contato

Hiarley Costa - [HiarleyCosta](https://www.linkedin.com/in/hiarleysilva/) - contato.hiarleycosta@gmail.com

Link do projeto: [https://github.com/MarkHiarley/api-cardapio](https://github.com/MarkHiarley/api-cardapio)

## Agradecimentos

* [MIT License](https://opensource.org/license/mit)
* [Firebase](https://firebase.google.com/) - Backend-as-a-Service utilizado
* [Express.js](https://expressjs.com/) - Framework web para Node.js
* [Node.js](https://nodejs.org/) - Runtime JavaScript
* [Docker](https://www.docker.com/) - Plataforma de containerização