# 🚀 Deploy na Vercel - Passo a Passo

## 📋 Variáveis de Ambiente

Adicione estas **8 variáveis** em **Settings → Environment Variables**:

```
MONGODB_URI
mongodb+srv://novoamanhecerpt_db_user:g49krfMbBv1ErReN@novoamanhecerpt.mes3omv.mongodb.net/?appName=NovoAmanhecerpt

EMAIL_HOST
smtp.gmail.com

EMAIL_PORT
587

EMAIL_USER
novoamanhecerpt@gmail.com

EMAIL_PASS
tbffculzalpaylcx

EMAIL_FROM
novoamanhecerpt@gmail.com

EMAIL_FROM_NAME
Novo Amanhecer

NODE_ENV
production
```

---

## 🎯 Passo a Passo Completo

### 1️⃣ **Preparar o Projeto**

✅ Arquivos já estão prontos:
- `vercel.json` - Configuração otimizada
- `api/package.json` - Node 20.x fixo
- `api/index.js` - API serverless
- `api/db.js` - MongoDB configurado

### 2️⃣ **Fazer Commit no Git**

```bash
git add .
git commit -m "Deploy Novo Amanhecer - MongoDB Atlas configurado"
git push origin main
```

### 3️⃣ **Importar na Vercel**

1. Acesse: https://vercel.com
2. Faça login
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório **NovoAmanhecer**
5. Clique em **"Import"**

### 4️⃣ **Configurar Variáveis**

1. **Antes** de fazer deploy, clique em **"Environment Variables"**
2. Adicione **TODAS as 8 variáveis** acima
3. Para cada uma:
   - Nome: (ex: `MONGODB_URI`)
   - Value: (cole o valor)
   - Marque: **Production**, **Preview**, **Development**
   - Clique **"Add"**

### 5️⃣ **Deploy**

1. Clique em **"Deploy"**
2. Aguarde 1-2 minutos
3. Quando aparecer "🎉 Congratulations!", está pronto!

### 6️⃣ **Testar**

1. Clique no link do deploy (ex: `novoamanhecer.vercel.app`)
2. Teste as páginas:
   - Homepage ✅
   - Login ✅
   - Cadastro ✅
   - Dashboard ✅

---

## ⚠️ Avisos que Podem Aparecer (É Normal!)

### ✅ WARN: `builds` existing
**Status**: ✅ **RESOLVIDO!** Otimizei o vercel.json

### ✅ WARN: Node.js version auto-upgrade
**Status**: ✅ **RESOLVIDO!** Fixei para Node 20.x

---

## 🔧 Após o Deploy

### Atualizar Link no Email

Edite `api/index.js` linha 293, troque:

```javascript
// ANTES
<a href="http://localhost:3000/login.html"

// DEPOIS
<a href="https://SEU-DOMINIO.vercel.app/login.html"
```

Substitua `SEU-DOMINIO` pelo domínio que a Vercel criou.

---

## 📊 O Que Será Implantado

✅ **8 Páginas HTML**
- index.html
- login.html
- cadastro.html
- dashboard.html
- dashboard-admin.html
- buscar-cuidadores.html
- perfil-cuidador.html

✅ **API Backend**
- Funções serverless
- MongoDB Atlas
- Envio de emails

✅ **Assets**
- CSS otimizado
- JavaScript funcional
- Imagens (incluindo logo corrigida!)

---

## 🌐 Domínio

Após o deploy, você terá um domínio como:

`https://novoamanhecer.vercel.app`

Você pode configurar um domínio personalizado depois!

---

## ✅ Checklist Final

Antes de fazer deploy:

- [x] Variáveis de ambiente configuradas (8)
- [x] MongoDB URI adicionada
- [x] Email configurado
- [x] vercel.json otimizado
- [x] package.json atualizado
- [x] Código commitado no Git
- [ ] Deploy iniciado
- [ ] Site testado em produção

---

## 🎉 Resultado Esperado

Quando funcionar, você verá:

```
✅ Deployment Ready
🌐 https://novoamanhecer.vercel.app
⏱️ Ready in 45s
```

Clique no link e seu site estará **ONLINE** para o mundo todo! 🌍

---

**Boa sorte com o deploy! 🚀**

