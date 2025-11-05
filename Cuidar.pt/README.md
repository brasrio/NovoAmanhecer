# 🏥 Cuidar.pt

> Plataforma portuguesa que conecta famílias a cuidadores e enfermeiros qualificados

![Cuidar.pt](assets/images/hero-care.jpg)

[![Deploy Status](https://img.shields.io/badge/deploy-vercel-brightgreen)](https://vercel.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)

---

## 📋 Sobre o Projeto

**Cuidar.pt** é uma plataforma web completa desenvolvida para conectar famílias portuguesas com cuidadores e enfermeiros profissionais verificados. O sistema oferece:

- 🔍 **Busca inteligente** de profissionais com múltiplos filtros
- 👤 **Perfis profissionais** completos com fotos e especialidades  
- 📊 **Dashboard administrativo** para gestão de usuários
- 💰 **Sistema de precificação** transparente por hora
- 📅 **Gerenciamento de disponibilidade** por dia da semana
- 🌍 **Cobertura em todo Portugal** com filtros por cidade

---

## 🚀 Tecnologias

### Frontend
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Design responsivo com CSS Grid e Flexbox
- **JavaScript ES6+** - Interatividade moderna

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB Atlas** - Banco de dados NoSQL em nuvem
- **Nodemailer** - Envio de emails

### Deploy
- **Vercel** - Hospedagem e deploy automático
- **Git** - Controle de versão

---

## 📁 Estrutura do Projeto

```
Cuidar.pt/
├── assets/                    # Recursos estáticos
│   ├── css/                   # Estilos CSS
│   │   ├── styles.css         # Estilos globais
│   │   ├── dashboard.css      # Dashboard
│   │   ├── dashboard-admin.css # Admin
│   │   ├── cadastro.css       # Cadastro
│   │   ├── perfil-cuidador.css # Perfil
│   │   └── buscar-cuidadores.css # Busca
│   ├── js/                    # Scripts JavaScript
│   │   ├── main.js            # Script principal
│   │   ├── config.js          # Configurações
│   │   ├── cadastro.js        # Lógica de cadastro
│   │   ├── login.js           # Lógica de login
│   │   ├── dashboard.js       # Dashboard
│   │   ├── perfil-cuidador.js # Perfil
│   │   ├── buscar-cuidadores.js # Busca
│   │   ├── localizacoes-portugal.js # Dados de cidades
│   │   └── validacao-telefone.js # Validações
│   └── images/                # Imagens e ícones
│       ├── logo.svg
│       ├── hero-care.jpg
│       ├── nurse-icon.jpg
│       └── caregiver-icon.jpg
│
├── api/                       # Backend Node.js
│   ├── index.js               # API REST
│   ├── db.js                  # Conexão MongoDB
│   ├── package.json           # Dependências
│   └── node_modules/          # Pacotes npm
│
├── index.html                 # Landing page
├── cadastro.html              # Página de cadastro
├── login.html                 # Página de login
├── dashboard.html             # Dashboard do usuário
├── dashboard-admin.html       # Painel administrativo
├── perfil-cuidador.html       # Perfil profissional
├── buscar-cuidadores.html     # Busca de cuidadores
├── vercel.json                # Configuração Vercel
└── README.md                  # Documentação
```

---

## ✨ Funcionalidades

### 🏠 Landing Page
- Design moderno e responsivo
- Navegação suave entre seções
- Call-to-actions estratégicos
- SEO otimizado

### 👥 Sistema de Usuários
- **3 tipos de usuário**: Cliente, Cuidador, Administrador
- Cadastro completo com validações
- Sistema de login seguro
- Autenticação e autorização por roles
- Redirecionamento inteligente por perfil

### 🔍 Busca de Cuidadores
- Filtros por:
  - 📍 Cidade/região
  - 💰 Valor máximo por hora
  - 📅 Disponibilidade (dia da semana)
  - 🎓 Qualificações específicas
- Ordenação por relevância, preço ou experiência
- Cards visuais com fotos
- Modal de perfil completo
- Sistema estilo "iFood/Uber"

### 👨‍⚕️ Perfil do Cuidador
- Upload de foto de perfil (até 2MB)
- Definição de valor por hora (€)
- Descrição profissional (máx. 500 caracteres)
- Anos de experiência
- Seleção de múltiplas áreas de atuação
- Sistema de qualificações (adicionar/remover)
- Disponibilidade por dia da semana com horários
- Edição e atualização em tempo real

### 👑 Dashboard Administrativo
- Estatísticas em tempo real
- Listagem completa de usuários por tipo
- Cards coloridos e intuitivos:
  - 👑 Admins (roxo)
  - 👨‍⚕️ Cuidadores (verde água)
  - 👤 Clientes (amarelo)
- Visualização de perfis profissionais
- Ações: Ver detalhes, Editar, Ativar/Desativar
- Acesso restrito a administradores

### 📧 Sistema de Email
- Envio automático de credenciais após cadastro
- Template HTML profissional
- Configurável via SMTP

---

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 14.0.0 ou superior
- NPM ou Yarn
- Conta no MongoDB Atlas (gratuita)
- Conta no Vercel (opcional, para deploy)

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/seu-usuario/cuidar.pt.git
cd cuidar.pt
```

### Passo 2: Configure o Backend

```bash
cd api
npm install
```

### Passo 3: Configure o MongoDB Atlas

1. Crie uma conta gratuita em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um novo cluster (opção M0 gratuita)
3. Configure o acesso à rede (whitelist seu IP ou use 0.0.0.0/0 para todos)
4. Crie um usuário de banco de dados
5. Obtenha sua connection string

### Passo 4: Configure as Variáveis de Ambiente

Crie um arquivo `.env` na pasta `api/`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/cuidarpt

# Email (opcional, para envio de credenciais)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app

# Porta do servidor
PORT=3000
```

### Passo 5: Inicie o Servidor

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em: `http://localhost:3000`

### Passo 6: Acesse o Sistema

Abra seu navegador e acesse:
- **Landing Page**: http://localhost:3000/index.html
- **Login**: http://localhost:3000/login.html
- **Cadastro**: http://localhost:3000/cadastro.html

---

## 🔐 Credenciais de Admin

Para acessar o dashboard administrativo pela primeira vez:

```
Email: admin@cuidar.pt
Senha: Admin@2024
```

> ⚠️ **Importante**: Altere essas credenciais após o primeiro acesso!

---

## 🚀 Deploy no Vercel

### Deploy Automático

1. Faça push do código para o GitHub
2. Acesse [Vercel](https://vercel.com) e faça login
3. Clique em "New Project"
4. Importe seu repositório do GitHub
5. Configure as variáveis de ambiente:
   - `MONGODB_URI`
   - `EMAIL_USER` (opcional)
   - `EMAIL_PASS` (opcional)
6. Clique em "Deploy"

### Deploy via CLI

```bash
# Instale o Vercel CLI
npm install -g vercel

# Faça login
vercel login

# Deploy
vercel
```

---

## 📱 Responsividade

O sistema é 100% responsivo e funciona perfeitamente em:

- 📱 **Mobile** (320px - 768px)
- 📱 **Tablet** (768px - 1024px)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

---

## 🎨 Personalização

### Cores

Edite as variáveis CSS em `assets/css/styles.css`:

```css
:root {
    --primary: #1e5ede;      /* Azul principal */
    --secondary: #3abebd;    /* Verde água */
    --accent: #f9a826;       /* Amarelo */
    --dark: #1e3a5f;         /* Azul escuro */
    --light: #f8f9fa;        /* Cinza claro */
}
```

### Conteúdo

Todo o conteúdo pode ser editado diretamente nos arquivos HTML.

### Logo

Substitua o arquivo `assets/images/logo.svg` pelo seu logo.

---

## 🧪 Testes

### Testar Localmente

1. Inicie o servidor backend
2. Abra o navegador em modo privado
3. Teste o fluxo completo:
   - Cadastro → Login → Dashboard → Perfil → Busca

### Testar Responsividade

Use o DevTools do navegador:
- `F12` → Toggle device toolbar
- Teste em diferentes resoluções

---

## 📊 API Endpoints

### Usuários
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Login
- `GET /api/users` - Listar usuários (admin)
- `GET /api/users/:id` - Obter usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário (admin)

### Cuidadores
- `GET /api/cuidadores` - Listar cuidadores com filtros
- `PUT /api/cuidadores/:id/perfil` - Atualizar perfil

---

## 🔒 Segurança

- ✅ Senhas hasheadas (bcrypt)
- ✅ Validação de dados no backend
- ✅ Proteção contra SQL Injection (NoSQL)
- ✅ CORS configurado
- ✅ Rate limiting (opcional)
- ✅ Headers de segurança

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📝 Changelog

### v1.0.0 (2024)
- ✅ Landing page responsiva
- ✅ Sistema de cadastro e login
- ✅ Dashboard administrativo
- ✅ Perfil do cuidador
- ✅ Busca de cuidadores
- ✅ Integração com MongoDB Atlas
- ✅ Deploy no Vercel

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Seu Nome]

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Nome](https://linkedin.com/in/seu-perfil)
- Email: seu-email@exemplo.com

---

## 🙏 Agradecimentos

- Inspiração de design: [iFood](https://www.ifood.com.br), [Uber](https://www.uber.com)
- Ícones: [Font Awesome](https://fontawesome.com)
- Imagens: [Unsplash](https://unsplash.com)

---

## 📞 Suporte

Precisa de ajuda? Entre em contato:

- 📧 Email: suporte@cuidar.pt
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/cuidar.pt/issues)

---

<div align="center">
  <strong>⭐ Se este projeto foi útil, deixe uma estrela! ⭐</strong>
</div>
