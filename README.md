<div align="center">
    <h1>🍽️ API Cardápio</h1>
    <h5 align="center">
        Uma API REST completa para gerenciamento de cardápios com integração de pagamentos PIX via WhatsApp
    </h5>
    <p align="center">
        &middot;
        <a target="_blank" href="#endpoints">Documentação</a>
        &middot;
        <a target="_blank" href="#pagamentos">Pagamentos</a>
        &middot;
        <a target="_blank" href="#docker">Docker</a>
        &middot;
    </p>
</div>

## 📋 Sobre
<p>
  Esta API foi desenvolvida para facilitar o gerenciamento completo de cardápios de restaurantes, lanchonetes e estabelecimentos alimentícios. Além do CRUD básico de produtos, a API oferece integração com sistema de pagamentos PIX e notificações automáticas via WhatsApp.
</p>
<p>
  A API utiliza Firebase Realtime Database para armazenamento em tempo real, AbacatePay para geração de QR Codes PIX e Evolution API para automação do WhatsApp. Todos os preços são automaticamente formatados e validados, garantindo consistência nos dados.
</p>
<p>
  Ideal para sistemas de delivery, aplicativos mobile, totens de autoatendimento e qualquer solução que precise de gestão de produtos com pagamentos integrados.
</p>  

## 🛠️ Feito com
* <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
* <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
* <img src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase"/>
* <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"/>
* <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/>
<br>

## 🚀 Funcionalidades

- ✅ **CRUD Completo de Produtos** - Cadastrar, listar, editar e deletar produtos
- ✅ **Geração de QR Code PIX** - Integração com AbacatePay
- ✅ **Automação WhatsApp** - Envio automático de código PIX e imagem do QR Code
- ✅ **Validação de Dados** - Validação robusta de preços e campos obrigatórios
- ✅ **Formatação Automática** - Preços arredondados automaticamente
- ✅ **Firebase Integration** - Banco de dados em tempo real
- ✅ **Docker Support** - Containerização completa
- ✅ **Error Handling** - Tratamento de erros padronizado

## 📚 Endpoints

### 🏠 Status da API
**GET** `/`

Retorna informações básicas da API.

**Resposta:**
```json
{
  "message": "API Cardápio is running",
  "version": "1.0.0",
  "getData": "Use /cardapio to get the menu data http://localhost:8000/cardapio"
}
```

### 📋 Listar Produtos
**GET** `/cardapio`

Lista todos os produtos do cardápio.

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "data": {
    "pratos": {
      "-Ow1NsvpAJAvADeOEezg": {
        "nome": "Hambúrguer Clássico",
        "preco": 25.90,
        "categoria": "hamburguers",
        "descricao": "Hambúrguer com carne, alface, tomate e queijo",
        "disponivel": true,
        "criadoEm": "2025-07-28T15:33:36.250Z"
      }
    }
  }
}
```

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
    "criadoEm": "2025-07-28T15:33:36.250Z"
  }
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
    "id": "-Ow1NsvpAJAvADeOEezg",
    "produto_deletado": {
      "nome": "Hambúrguer Clássico",
      "preco": 25.90,
      "categoria": "hamburguers"
    }
  }
}
```

## 💳 Sistema de Pagamentos

### 🔄 Criar Pagamento PIX + WhatsApp
**POST** `/pagamento/qr-code-create`

Cria um QR Code PIX e envia automaticamente via WhatsApp (texto + imagem).

**Body (JSON):**
```json
{
  "amount": 2500,
  "number": "5588981061375"
}
```

**Resposta de sucesso (201):**
```json
{
  "success": true,
  "message": "QR Code criado, texto e imagem enviados com sucesso",
  "qrcode_data": {
    "id": "pix_char_XtCK5duRaJP4kEGu5UNDxrau",
    "amount": 2500,
    "brCode": "00020101021126580014BR.GOV.BCB.PIX...",
    "status": "PENDING",
    "expiresAt": "2025-07-29T02:34:33.436Z"
  },
  "whatsapp_results": {
    "texto": {
      "key": { "id": "msg_123" },
      "message": { "conversation": "Código enviado" },
      "messageTimestamp": 1753671837
    },
    "imagem": {
      "key": { "id": "img_456" },
      "message": { "imageMessage": "QR Code enviado" }
    }
  }
}
```

### 🔧 APIs Integradas

**AbacatePay (PIX):**
- Geração de QR Codes PIX
- Valores em centavos (2500 = R$ 25,00)
- Códigos com validade de 24 horas

**Evolution API (WhatsApp):**
- Envio de mensagens de texto
- Envio de imagens/mídia
- Integração com instâncias WhatsApp

## ✅ Validações

### 📝 Campos Obrigatórios
- **nome**: Mínimo 2 caracteres
- **preco**: Apenas números, aceita vírgula ou ponto como separador decimal
- **categoria**: Mínimo 2 caracteres
- **amount**: Valor em centavos para pagamentos
- **number**: Número do WhatsApp com código do país

### 💰 Formatação de Preços
- Preços são automaticamente arredondados para 2 casas decimais
- `25.9344343` → `25.93`
- `25.999` → `26.00`
- Aceita tanto vírgula quanto ponto como separador decimal

### ❌ Tratamento de Erros
- **400**: Dados inválidos ou campos obrigatórios ausentes
- **404**: Produto não encontrado (ao deletar)
- **500**: Erro interno do servidor
- **400**: Erro na geração do QR Code PIX
- **400**: Erro no envio do WhatsApp

## 🔧 Configuração e Instalação

### 📋 Pré-requisitos
- Node.js 18+
- Conta Firebase com Realtime Database
- Conta AbacatePay (API Key)
- Evolution API (Instância WhatsApp)

### 🚀 Instalação Local

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
   ```
   
   **Variáveis necessárias (.env):**
   ```env
   # Firebase
   FIREBASE_API_KEY=sua_api_key
   FIREBASE_AUTH_DOMAIN=projeto.firebaseapp.com
   FIREBASE_DATABASE_URL=https://projeto.firebaseio.com
   FIREBASE_PROJECT_ID=seu_projeto_id
   FIREBASE_STORAGE_BUCKET=projeto.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789
   FIREBASE_APP_ID=1:123:web:abc123
   FIREBASE_MEASUREMENT_ID=G-ABC123
   
   # AbacatePay
   APIKEY_ABACATE=sua_api_key_abacate
   
   # Evolution API
   EVOLUTION_URL=https://evolution.hiarley.me
   ZAP_API_KEY=sua_api_key_evolution
   ```

4. **Execute em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Ou execute a versão de produção**
   ```bash
   npm start
   ```

A aplicação estará disponível em `http://localhost:8000`.

### 🐳 Docker

**Docker Simples:**
```bash
# Construir a imagem
docker build -t api-cardapio .

# Executar o container
docker run -p 8000:8000 --env-file .env api-cardapio
```

**Scripts disponíveis:**
```bash
npm run docker:build  # Construir imagem Docker
npm run docker:run    # Executar container
```

## 📁 Estrutura do Projeto

```
api-cardapio/
├── src/
│   ├── services/
│   │   ├── db/
│   │   │   ├── get-data.js           # Buscar produtos
│   │   │   ├── post-data.js          # Cadastrar produtos
│   │   │   └── dele-data.js          # Deletar produtos
│   │   └── payment/
│   │       ├── post-qrcode.js        # Gerar QR Code PIX
│   │       ├── send-qrcode-zap.js    # Enviar texto WhatsApp
│   │       └── send-qrcode-image.js  # Enviar imagem WhatsApp
│   ├── firebase.js                   # Configuração Firebase
│   └── app.js                        # Servidor Express
├── .env.example                      # Exemplo de variáveis
├── .gitignore
├── package.json
├── Dockerfile
└── README.md
```

## 🔗 Integrações Externas

### Firebase Realtime Database
- **Estrutura dos dados:**
  ```
  cardapio/
  └── pratos/
      └── [id_gerado]/
          ├── nome: "Produto"
          ├── preco: 25.90
          ├── categoria: "categoria"
          ├── descricao: "Descrição"
          ├── disponivel: true
          └── criadoEm: "2025-07-28T..."
  ```

### AbacatePay API
- **Endpoint:** `https://api.abacatepay.com/v1/pixQrCode/create`
- **Autenticação:** Bearer Token
- **Formato:** Valores em centavos

### Evolution API
- **Endpoint:** `https://evolution.hiarley.me/message/`
- **Recursos utilizados:**
  - `/sendText/{instancia}` - Envio de texto
  - `/sendMedia/{instancia}` - Envio de imagens
- **Autenticação:** API Key no header

## 📊 Exemplos de Uso

### cURL
```bash
# Cadastrar produto
curl -X POST http://localhost:8000/cardapio/cadastrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Pizza Margherita",
    "preco": "35,50",
    "categoria": "pizzas",
    "descricao": "Pizza tradicional italiana"
  }'

# Listar produtos
curl http://localhost:8000/cardapio

# Deletar produto
curl -X DELETE http://localhost:8000/cardapio/deletar/ID_DO_PRODUTO

# Criar pagamento PIX
curl -X POST http://localhost:8000/pagamento/qr-code-create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "number": "5588981061375"
  }'
```

### JavaScript/Fetch
```javascript
// Cadastrar produto
const produto = await fetch('http://localhost:8000/cardapio/cadastrar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Coca-Cola',
    preco: 5.50,
    categoria: 'bebidas',
    descricao: 'Refrigerante 350ml'
  })
});

// Criar pagamento
const pagamento = await fetch('http://localhost:8000/pagamento/qr-code-create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 550, // R$ 5,50 em centavos
    number: '5588981061375'
  })
});
```

## 🛠️ Scripts Disponíveis

```bash
npm start          # Inicia a aplicação
npm run dev        # Modo desenvolvimento com nodemon
npm run docker:build  # Construir imagem Docker
npm run docker:run    # Executar container Docker
```

## 🗺️ Roadmap

- [ ] ✏️ Endpoint para editar produtos
- [ ] 🔍 Busca por categoria e filtros
- [ ] 📊 Dashboard de vendas e estatísticas
- [ ] 🔐 Autenticação JWT e roles
- [ ] 📱 Upload de imagens dos produtos
- [ ] 💾 Cache com Redis
- [ ] 📚 Documentação Swagger/OpenAPI
- [ ] 🔔 Webhooks para status de pagamento
- [ ] 📈 Analytics e métricas
- [ ] 🌐 API Gateway com rate limiting

## 🤝 Contribuições

1. Faça um fork desse repositório
2. Crie uma nova branch: `git checkout -b feature/NovaFeature`
3. Faça um commit: `git commit -m 'Adicionar NovaFeature'`
4. Push para a branch: `git push origin feature/NovaFeature`
5. Crie um Pull Request

## 📄 Licença

Distribuído sob a Licença MIT. Consulte `LICENSE.txt` para mais informações.

## 📞 Contato

**Hiarley Costa** - [LinkedIn](https://www.linkedin.com/in/hiarleysilva/) - contato.hiarleycosta@gmail.com

**Link do projeto:** [https://github.com/MarkHiarley/api-cardapio](https://github.com/MarkHiarley/api-cardapio)

## 🙏 Agradecimentos

* [Firebase](https://firebase.google.com/) - Backend-as-a-Service
* [Express.js](https://expressjs.com/) - Framework web para Node.js
* [AbacatePay](https://abacatepay.com/) - Gateway de pagamentos PIX
* [Evolution API](https://evolution.github.io/) - API para automação WhatsApp
* [Node.js](https://nodejs.org/) - Runtime JavaScript
* [Docker](https://www.docker.com/) - Plataforma de containerização