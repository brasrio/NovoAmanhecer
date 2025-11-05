# 🚀 Variáveis de Ambiente para Vercel

## 📋 Copie e Cole no Vercel

Acesse: **Settings → Environment Variables** no seu projeto Vercel

---

## 🔐 Variáveis Obrigatórias

### 1. MongoDB Atlas
```
Nome: MONGODB_URI
Valor: mongodb+srv://novoamanhecerpt_db_user:g49krfMbBv1ErReN@novoamanhecerpt.mes3omv.mongodb.net/?appName=NovoAmanhecerpt
```

### 2. Email - Host
```
Nome: EMAIL_HOST
Valor: smtp.gmail.com
```

### 3. Email - Porta
```
Nome: EMAIL_PORT
Valor: 587
```

### 4. Email - Usuário
```
Nome: EMAIL_USER
Valor: novoamanhecerpt@gmail.com
```

### 5. Email - Senha
```
Nome: EMAIL_PASS
Valor: tbffculzalpaylcx
```

### 6. Email - Remetente
```
Nome: EMAIL_FROM
Valor: novoamanhecerpt@gmail.com
```

### 7. Email - Nome do Remetente
```
Nome: EMAIL_FROM_NAME
Valor: Novo Amanhecer
```

### 8. Ambiente
```
Nome: NODE_ENV
Valor: production
```

---

## 📝 Formato para Copiar/Colar Rápido

Cole isso na Vercel (uma variável por linha):

```
MONGODB_URI=mongodb+srv://novoamanhecerpt_db_user:g49krfMbBv1ErReN@novoamanhecerpt.mes3omv.mongodb.net/?appName=NovoAmanhecerpt
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=novoamanhecerpt@gmail.com
EMAIL_PASS=tbffculzalpaylcx
EMAIL_FROM=novoamanhecerpt@gmail.com
EMAIL_FROM_NAME=Novo Amanhecer
NODE_ENV=production
```

---

## 🎯 Passo a Passo na Vercel

### 1️⃣ Fazer Login na Vercel
- Acesse: https://vercel.com
- Faça login

### 2️⃣ Importar o Projeto
- Clique em "Add New..."
- Selecione "Project"
- Importe do GitHub: `NovoAmanhecer`

### 3️⃣ Configurar Variáveis
- Vá em **Settings** → **Environment Variables**
- Adicione cada variável acima
- Clique em "Save"

### 4️⃣ Deploy
- Vá em **Deployments**
- Clique em "Redeploy"
- Aguarde o deploy finalizar

### 5️⃣ Acessar o Site
- Sua URL será algo como: `novoamanhecer.vercel.app`
- Acesse e teste!

---

## ✅ Checklist

Antes de fazer deploy, certifique-se:

- [ ] Todas as 8 variáveis adicionadas
- [ ] MongoDB Atlas acessível
- [ ] Email configurado no Gmail (senha de app)
- [ ] Arquivo `vercel.json` está na raiz
- [ ] Pasta `api` contém index.js e db.js

---

## 🔧 Troubleshooting

### Se der erro no deploy:

**Erro**: "Cannot find module 'mongodb'"
**Solução**: Certifique-se que `api/package.json` existe e tem as dependências

**Erro**: "Failed to connect to MongoDB"
**Solução**: Verifique se a string MONGODB_URI está correta (sem espaços)

**Erro**: "Email not sent"
**Solução**: Verifique a senha de app do Gmail

---

## 📧 Atualizar Link de Login no Email

Depois do deploy, atualize o link no email (linha 293 do `api/index.js`):

**Troque**:
```javascript
<a href="http://localhost:3000/login.html"
```

**Por**:
```javascript
<a href="https://seu-dominio.vercel.app/login.html"
```

---

## 🎉 Resultado Final

Depois do deploy na Vercel:

✅ Site acessível globalmente  
✅ MongoDB Atlas (dados na nuvem)  
✅ Emails enviados automaticamente  
✅ SSL/HTTPS automático  
✅ CDN global da Vercel  
✅ Zero configuração de servidor  

---

**Cole essas variáveis na Vercel e faça o deploy! 🚀**

