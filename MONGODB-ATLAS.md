# 🌐 MongoDB Atlas - Novo Amanhecer

## ✅ Configuração Completa

O sistema agora está configurado para usar **MongoDB Atlas** na nuvem!

---

## 🔐 Credenciais Configuradas

- **Usuário**: novoamanhecerpt_db_user
- **Senha**: g49krfMbBv1ErReN
- **Cluster**: novoamanhecerpt.mes3omv.mongodb.net
- **Banco de Dados**: novoamanhecer
- **Coleção**: users

---

## 📋 String de Conexão

```
mongodb+srv://novoamanhecerpt_db_user:g49krfMbBv1ErReN@novoamanhecerpt.mes3omv.mongodb.net/?appName=NovoAmanhecerpt
```

---

## ✅ Arquivos Atualizados

1. ✅ **api/.env** - Variável MONGODB_URI configurada
2. ✅ **api/db.js** - Nome do banco alterado para "novoamanhecer"
3. ✅ **api/index.js** - Já estava preparado para MongoDB

---

## 🔄 Como Funciona Agora

### 🗄️ **Antes (Modo Local)**
- Dados salvos em `api/users.json`
- Perdidos ao reiniciar servidor
- Apenas para desenvolvimento

### ☁️ **Agora (MongoDB Atlas)**
- Dados salvos na nuvem
- Persistentes entre reinicializações
- Pronto para produção
- Backup automático
- Escalável

---

## 📊 Estrutura no MongoDB

### Collection: `users`

Campos dos documentos:
```json
{
  "_id": ObjectId (gerado automaticamente),
  "id": "string única",
  "nome": "string",
  "email": "string (lowercase)",
  "telefone": "string",
  "distrito": "string",
  "cidade": "string",
  "userType": "admin|cuidador|familia",
  "role": "admin|cuidador|cliente",
  "senha": "string",
  "isActive": boolean,
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

---

## 🎯 Usuários Iniciais

Os seguintes usuários estão no `users.json` local e serão **migrados** para o MongoDB quando fizerem login:

1. **richard@admin.com** / dido (Admin)
2. **babi@admin.com** / babi (Admin)
3. **didoteste199@gmail.com** / [senha gerada] (Família)

---

## 🚀 Próximos Passos

### 1️⃣ **Criar Usuários Admin no MongoDB**

Você pode criar diretamente no MongoDB Atlas ou fazer login com as credenciais.

### 2️⃣ **Verificar Conexão**

Quando o servidor iniciar, você verá:
```
🔌 Conectando ao MongoDB Atlas...
✅ Conectado ao MongoDB Atlas!
🗄️  Usando banco: MongoDB Atlas
```

### 3️⃣ **Testar Cadastro**

Faça um cadastro de teste e veja os dados sendo salvos na nuvem!

---

## 🔍 Acessar o MongoDB Atlas

1. Acesse: https://cloud.mongodb.com/
2. Faça login
3. Vá para o cluster **NovoAmanhecerpt**
4. Clique em "Browse Collections"
5. Veja o banco **novoamanhecer**
6. Collection **users**

---

## ⚠️ Importante

### Segurança
- ✅ String de conexão com credenciais no .env
- ✅ Senha de app do Gmail configurada
- ✅ Conexão criptografada (SSL)

### Backup
- MongoDB Atlas faz backup automático
- Dados seguros na nuvem
- Recuperação em caso de falha

---

## ✅ Status

- ✅ MongoDB Atlas configurado
- ✅ Banco de dados: novoamanhecer
- ✅ Email: novoamanhecerpt@gmail.com
- ✅ Pronto para produção na Vercel!

---

**MongoDB Atlas ativado! Sistema pronto para a nuvem! ☁️🎉**

