# 📚 Exemplos Práticos - API Cardápio Master Mix

## 🔄 Fluxo Completo de Pagamento PIX

### 1. 💰 Criar QR Code PIX + WhatsApp

```bash
curl -X POST http://34.39.150.72:8000/pagamento/qr-code-create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "number": "5588981061375"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "QR Code criado e enviado com sucesso",
  "qrcode_data": {
    "id": "pix_char_XtCK5duRaJP4kEGu5UNDxrau",
    "amount": 2500,
    "brCode": "00020101021126580014BR.GOV.BCB.PIX2584",
    "status": "PENDING",
    "expiresAt": "2025-07-29T02:34:33.436Z"
  },
  "whatsapp_results": {
    "texto": { "key": { "id": "msg_123" } },
    "imagem": { "key": { "id": "img_456" } }
  }
}
```

**⚠️ IMPORTANTE:** Salve o campo `"id"` para verificação posterior!

---

### 2. 🔍 Verificar Pagamento + Enviar Pedido

```bash
curl -X POST "http://34.39.150.72:8000/pagamento/qr-code-check?id=pix_char_XtCK5duRaJP4kEGu5UNDxrau" \
  -H "Content-Type: application/json" \
  -d '{
    "pedido": {
      "itens": [
        {
          "nome": "X-Burger",
          "quantidade": 1,
          "preco": 15.00
        },
        {
          "nome": "Coca-Cola",
          "quantidade": 1,
          "preco": 5.00
        }
      ],
      "total": 20.00,
      "entrega": "Retirada no balcão",
      "endereco": null,
      "pagamento": "PIX",
      "cliente_whatsapp": "5588981061375"
    }
  }'
```

**✅ Se Pago:**
```json
{
  "success": true,
  "message": "Pagamento confirmado e pedido enviado com sucesso",
  "payment_status": "PAID",
  "payment_data": {
    "data": {
      "id": "pix_char_XtCK5duRaJP4kEGu5UNDxrau",
      "status": "PAID",
      "amount": 2000,
      "paidAt": "2025-07-28T15:45:21Z"
    }
  }
}
```

**⏳ Se Pendente:**
```json
{
  "success": false,
  "message": "Pagamento ainda pendente",
  "status": "PENDING",
  "payment_data": {
    "data": {
      "status": "PENDING",
      "expiresAt": "2025-07-29T02:34:33.436Z"
    }
  }
}
```

---

## 🍔 CRUD Produtos

### 📋 Listar Cardápio

```bash
curl http://34.39.150.72:8000/cardapio
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "pratos": {
      "-Ow1NsvpAJAvADeOEezg": {
        "nome": "X-Burger",
        "preco": 15.00,
        "categoria": "hamburguers",
        "disponivel": true,
        "criadoEm": "2025-07-28T15:33:36.250Z"
      },
      "-Ow1NtvqBKBvCFfPGhij": {
        "nome": "Coca-Cola",
        "preco": 5.00,
        "categoria": "bebidas",
        "disponivel": true,
        "criadoEm": "2025-07-28T15:34:12.180Z"
      }
    }
  }
}
```

### ➕ Cadastrar Produto

```bash
curl -X POST http://34.39.150.72:8000/cardapio/cadastrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Pizza Margherita",
    "preco": "35,50",
    "categoria": "pizzas",
    "descricao": "Pizza tradicional italiana com molho de tomate, mussarela e manjericão"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Produto cadastrado com sucesso",
  "data": {
    "id": "-Ow1OxyZcMNvEjKlMnop",
    "nome": "Pizza Margherita",
    "preco": 35.50,
    "categoria": "pizzas",
    "descricao": "Pizza tradicional italiana com molho de tomate, mussarela e manjericão",
    "disponivel": true,
    "criadoEm": "2025-07-28T15:45:22.890Z"
  }
}
```

### ❌ Deletar Produto

```bash
curl -X DELETE http://34.39.150.72:8000/cardapio/deletar/-Ow1OxyZcMNvEjKlMnop
```

**Resposta:**
```json
{
  "success": true,
  "message": "Produto deletado com sucesso",
  "data": {
    "id": "-Ow1OxyZcMNvEjKlMnop",
    "produto_deletado": {
      "nome": "Pizza Margherita",
      "preco": 35.50,
      "categoria": "pizzas"
    }
  }
}
```

---

## 🧪 Testes de Erro

### ❌ Produto Não Encontrado

```bash
curl -X DELETE http://34.39.150.72:8000/cardapio/deletar/id-inexistente
```

**Resposta (404):**
```json
{
  "success": false,
  "message": "Produto não encontrado",
  "id_fornecido": "id-inexistente"
}
```

### ❌ Rota Não Encontrada

```bash
curl http://34.39.150.72:8000/rota-inexistente
```

**Resposta (404):**
```json
{
  "success": false,
  "message": "Rota não encontrada",
  "requested_path": "/rota-inexistente",
  "available_endpoints": [
    "GET /",
    "GET /cardapio",
    "POST /cardapio/cadastrar",
    "DELETE /cardapio/deletar/:id",
    "POST /pagamento/qr-code-create",
    "POST /pagamento/qr-code-check?id=payment_id"
  ]
}
```

### ❌ Dados Inválidos no Cadastro

```bash
curl -X POST http://34.39.150.72:8000/cardapio/cadastrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "",
    "preco": "abc",
    "categoria": ""
  }'
```

**Resposta (400):**
```json
{
  "success": false,
  "message": "Dados inválidos",
  "details": "Nome, preço e categoria são obrigatórios"
}
```

### ❌ Pagamento - Dados Faltando

```bash
curl -X POST http://34.39.150.72:8000/pagamento/qr-code-create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 0
  }'
```

**Resposta (400):**
```json
{
  "success": false,
  "message": "Valor do pagamento é obrigatório e deve ser maior que zero",
  "received_amount": 0
}
```

---

## 💻 JavaScript/Node.js

### 🔄 Exemplo Completo em JavaScript

```javascript
class MasterMixAPI {
  constructor(baseURL = 'http://34.39.150.72:8000') {
    this.baseURL = baseURL;
  }

  // Buscar cardápio
  async getCardapio() {
    const response = await fetch(`${this.baseURL}/cardapio`);
    return await response.json();
  }

  // Cadastrar produto
  async cadastrarProduto(produto) {
    const response = await fetch(`${this.baseURL}/cardapio/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    });
    return await response.json();
  }

  // Criar pagamento PIX
  async criarPagamentoPIX(amount, number) {
    const response = await fetch(`${this.baseURL}/pagamento/qr-code-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, number })
    });
    return await response.json();
  }

  // Verificar pagamento
  async verificarPagamento(paymentId, pedido) {
    const response = await fetch(`${this.baseURL}/pagamento/qr-code-check?id=${paymentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedido })
    });
    return await response.json();
  }
}

// Uso da classe
const api = new MasterMixAPI();

// Exemplo de fluxo completo
async function fluxoCompleto() {
  try {
    // 1. Buscar cardápio
    const cardapio = await api.getCardapio();
    console.log('Cardápio:', cardapio);

    // 2. Criar pagamento PIX (R$ 25,00)
    const pagamento = await api.criarPagamentoPIX(2500, '5588981061375');
    console.log('Pagamento criado:', pagamento);

    if (pagamento.success) {
      const paymentId = pagamento.qrcode_data.id;
      
      // 3. Aguardar e verificar pagamento
      setTimeout(async () => {
        const verificacao = await api.verificarPagamento(paymentId, {
          itens: [
            { nome: 'X-Burger', quantidade: 1, preco: 15.00 },
            { nome: 'Coca-Cola', quantidade: 1, preco: 5.00 }
          ],
          total: 20.00,
          entrega: 'Retirada no balcão',
          pagamento: 'PIX',
          cliente_whatsapp: '5588981061375'
        });
        
        console.log('Status do pagamento:', verificacao);
      }, 5000); // Aguarda 5 segundos
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

fluxoCompleto();
```

---

## 🎯 Dicas de Implementação

### 💡 Boas Práticas

1. **Sempre salve o ID do pagamento** retornado na criação do PIX
2. **Implemente retry logic** para verificação de pagamento
3. **Valide dados** antes de enviar para a API
4. **Trate erros** graciosamente com mensagens amigáveis
5. **Use timeouts** para evitar chamadas infinitas

### ⏱️ Timeouts Recomendados

- **Criação de PIX:** 10 segundos
- **Verificação de pagamento:** 30 segundos
- **Expiração de PIX:** 10 minutos (padrão da API)

### 🔄 Fluxo de Retry

```javascript
async function verificarPagamentoComRetry(paymentId, pedido, maxTentativas = 5) {
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      const resultado = await api.verificarPagamento(paymentId, pedido);
      
      if (resultado.success) {
        return resultado; // Pagamento confirmado
      }
      
      if (tentativa < maxTentativas) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Aguarda 3s
      }
    } catch (error) {
      console.error(`Tentativa ${tentativa} falhou:`, error);
    }
  }
  
  throw new Error('Pagamento não confirmado após todas as tentativas');
}
```

---

**🎉 Pronto! Agora você tem todos os exemplos necessários para integrar com a API Master Mix!**
