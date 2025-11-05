# 🔧 Como Corrigir o Servidor - Guia Manual

## ⚠️ Problema Atual

Há múltiplos processos Node.js rodando simultaneamente, causando conflitos.

---

## ✅ Solução (Passo a Passo)

### 1️⃣ **Abrir o Gerenciador de Tarefas**

Pressione: `Ctrl + Shift + Esc`

### 2️⃣ **Ir para Processos**

Procure por **"Node.js: Server-side JavaScript"** ou **"node.exe"**

### 3️⃣ **Encerrar TODOS os processos Node.js**

1. Clique em cada processo **Node.js**
2. Clique em **"Finalizar tarefa"**
3. Repita até **NÃO HAVER MAIS** processos Node

### 4️⃣ **Iniciar o Servidor Novamente**

Abra um **NOVO terminal PowerShell** e execute:

```powershell
cd C:\Users\BrasrioCG_02\Documents\GitHub\NovoAmanhecer\api
node index.js
```

**OU** use o comando curto:

```powershell
cd C:\Users\BrasrioCG_02\Documents\GitHub\NovoAmanhecer
npm start
```

### 5️⃣ **Verificar se Funcionou**

Você deve ver no terminal:

```
🚀 Servidor LOCAL rodando!
📍 URL: http://localhost:3000
🗄️  Banco: JSON Local (users.json)
👥 2 usuário(s) carregado(s)
```

### 6️⃣ **Testar no Navegador**

1. Abra: http://localhost:3000
2. **RECARREGUE** a página (F5)
3. Clique em "Encontrar Cuidador"
4. Deve funcionar! ✅

---

## 🎯 Resumo Rápido

1. **Gerenciador de Tarefas** (Ctrl+Shift+Esc)
2. **Matar todos** os "Node.js"
3. **Abrir novo terminal**
4. `cd C:\Users\BrasrioCG_02\Documents\GitHub\NovoAmanhecer`
5. `npm start`
6. **Recarregar** navegador

---

## ✅ Quando Estiver Funcionando

Você verá:
- ✅ URL no navegador funciona
- ✅ Botões "Encontrar Cuidador" levam para cadastro
- ✅ Botões "Tornar-me Cuidador" levam para cadastro
- ✅ Login e cadastro funcionam

---

**Siga esses passos e vai funcionar! 🎉**


