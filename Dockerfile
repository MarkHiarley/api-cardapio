# Usar a imagem oficial do Node.js
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /src

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código da aplicação
COPY . .

# Expor a porta que a aplicação usa
EXPOSE 8000

# Definir variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "start"]