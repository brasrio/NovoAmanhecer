/**
 * Cuidar.pt - API Serverless para Vercel
 * Funções serverless com MongoDB Atlas
 */

// Carrega variáveis de ambiente do arquivo .env (apenas em desenvolvimento local)
if (process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv').config();
    } catch (e) {
        console.log('⚠️  dotenv não instalado - usando variáveis do sistema');
    }
}

const nodemailer = require('nodemailer');
const db = require('./db');
const fs = require('fs');
const path = require('path');

// Usa MongoDB se MONGODB_URI estiver configurado, senão usa fallback em JSON/memória
const USE_MONGODB = !!process.env.MONGODB_URI;

// Arquivo JSON para persistência local
const DB_FILE = path.join(__dirname, 'users.json');

// Dados padrão
const DEFAULT_DATA = {
    users: [
        {
            id: "admin-1730000000000",
            nome: "Administrador",
            email: "admin@cuidar.pt",
            telefone: "+351000000000",
            distrito: "Lisboa",
            cidade: "Lisboa",
            userType: "admin",
            role: "admin",
            senha: "Admin@2024",
            isActive: true,
            createdAt: "2024-10-30T00:00:00.000Z",
            updatedAt: "2024-10-30T00:00:00.000Z"
        }
    ]
};

// Carrega dados do arquivo JSON (se existir) ou usa dados padrão
let memoryDB = (() => {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            console.log('📂 Dados carregados de users.json');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('⚠️  Erro ao ler users.json, usando dados padrão');
    }
    return DEFAULT_DATA;
})();

console.log(`🗄️  Usando banco: ${USE_MONGODB ? 'MongoDB Atlas' : 'JSON Local (users.json)'}`);
console.log(`👥 ${memoryDB.users.length} usuário(s) carregado(s)`);

// Salva dados no arquivo JSON
function saveToFile() {
    if (!USE_MONGODB) {
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify(memoryDB, null, 2), 'utf8');
            console.log('💾 Dados salvos em users.json');
        } catch (error) {
            console.error('❌ Erro ao salvar users.json:', error);
        }
    }
}

// Helper para obter usuários
async function getAllUsers() {
    if (USE_MONGODB) {
        return await db.getAllUsers();
    }
    return memoryDB.users;
}

// Helper para buscar usuário por email
async function getUserByEmail(email) {
    if (USE_MONGODB) {
        return await db.getUserByEmail(email);
    }
    return memoryDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Helper para buscar usuário por ID
async function getUserById(id) {
    if (USE_MONGODB) {
        return await db.getUserById(id);
    }
    return memoryDB.users.find(u => u.id === id);
}

// Helper para criar usuário
async function createUser(userData) {
    if (USE_MONGODB) {
        return await db.createUser(userData);
    }
    memoryDB.users.push(userData);
    saveToFile(); // Salva no arquivo JSON
    return userData;
}

// Helper para atualizar usuário
async function updateUser(id, updateData) {
    if (USE_MONGODB) {
        return await db.updateUser(id, updateData);
    }
    const index = memoryDB.users.findIndex(u => u.id === id);
    if (index !== -1) {
        memoryDB.users[index] = { ...memoryDB.users[index], ...updateData };
        saveToFile(); // Salva no arquivo JSON
        return memoryDB.users[index];
    }
    return null;
}

// Helper para listar cuidadores
async function getActiveCuidadores() {
    if (USE_MONGODB) {
        return await db.getActiveCuidadores();
    }
    return memoryDB.users.filter(u => 
        (u.role === 'cuidador' || u.userType === 'cuidador') && 
        (u.isActive !== false)
    );
}

// Configuração do email
function getEmailTransporter() {
    const config = {
        host: process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587'),
        secure: false, // true para 465, false para 587
        auth: {
            user: process.env.EMAIL_USER || process.env.SMTP_USER,
            pass: process.env.EMAIL_PASS || process.env.SMTP_PASS
        }
    };
    
    console.log(`📧 Email SMTP: ${config.host}:${config.port} (user: ${config.auth.user ? '✓' : '✗'})`);
    
    return nodemailer.createTransport(config);
}

// Handler principal da API
const handler = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url, method, query } = req;
    
    // Extrai o path removendo /api e query params
    let path = url.split('?')[0].replace('/api', '') || '/';
    
    // Se não tem path, usa a raiz
    if (!path || path === '/api') {
        path = '/';
    }

    console.log(`📥 ${method} ${path}`);

    try {
        // Root / Health check
        if (method === 'GET' && (path === '/' || path === '/health')) {
            return res.status(200).json({ 
                status: 'ok', 
                message: 'API Cuidar.pt está funcionando!',
                timestamp: new Date().toISOString(),
                path: path,
                url: url
            });
        }

        // Login
        if (method === 'POST' && path === '/login') {
            const { email, senha } = req.body;
            
            const user = await getUserByEmail(email);

            if (!user || user.senha !== senha) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou senha incorretos'
                });
            }

            if (user.isActive === false) {
                return res.status(403).json({
                    success: false,
                    message: 'Usuário desativado. Entre em contato com o suporte.'
                });
            }

            console.log(`✅ Login realizado: ${email}`);

            const { senha: _, ...userWithoutPassword } = user;
            return res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso!',
                user: userWithoutPassword
            });
        }

        // Cadastro
        if (method === 'POST' && path === '/cadastro') {
            const { nome, email, telefone, distrito, cidade, userType, senha } = req.body;

            // Verifica se o email já existe
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Este email já está cadastrado'
                });
            }

            // Determina o role baseado no userType
            let role = 'cliente';
            if (userType === 'cuidador') role = 'cuidador';
            if (userType === 'admin') role = 'admin';

            // Cria novo usuário
            const newUser = {
                id: Date.now().toString(),
                nome,
                email: email.toLowerCase(),
                telefone,
                distrito,
                cidade,
                userType,
                senha,
                role,
                isActive: true
            };

            await createUser(newUser);

            console.log(`✅ Cadastro realizado para ${email}`);

            // Enviar email (apenas se as credenciais estiverem configuradas)
            const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
            const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
            
            if (emailUser && emailPass) {
                try {
                    console.log(`📧 Tentando enviar email para ${email}...`);
                    const transporter = getEmailTransporter();
                    
                    await transporter.sendMail({
                        from: `"${process.env.EMAIL_FROM_NAME || 'Cuidar.pt'}" <${process.env.EMAIL_FROM || 'noreply@cuidar.pt'}>`,
                        to: email,
                        subject: 'Bem-vindo ao Cuidar.pt! 🎉',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h1 style="color: #3abebd;">Bem-vindo(a), ${nome}!</h1>
                                <p style="font-size: 16px;">Seu cadastro foi realizado com sucesso na plataforma <strong>Cuidar.pt</strong>.</p>
                                <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                    <p style="margin: 0;"><strong>📧 Email:</strong> ${email}</p>
                                    <p style="margin: 10px 0 0 0;"><strong>🔑 Senha:</strong> ${senha}</p>
                                </div>
                                <p style="font-size: 16px;">Acesse agora e complete seu perfil:</p>
                                <a href="http://localhost:3000/login.html" style="display: inline-block; background: #3abebd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Fazer Login</a>
                                <p style="margin-top: 30px; color: #666; font-size: 14px;">Se você não se cadastrou no Cuidar.pt, ignore este email.</p>
                            </div>
                        `
                    });
                    console.log('✅ Email de boas-vindas enviado com sucesso!');
                } catch (emailError) {
                    console.error('❌ Erro ao enviar email:', emailError.message);
                }
            } else {
                console.log('⚠️  Email não configurado (EMAIL_USER/EMAIL_PASS ausentes)');
            }

            const { senha: _, ...userWithoutPassword } = newUser;
            return res.status(201).json({
                success: true,
                message: 'Cadastro realizado com sucesso! Verifique seu email.',
                user: userWithoutPassword
            });
        }

        // Listar usuários (admin)
        if (method === 'GET' && path === '/users') {
            const users = await getAllUsers();
            const usersWithoutPasswords = users.map(({ senha, _id, ...user }) => user);
            return res.status(200).json({
                success: true,
                users: usersWithoutPasswords
            });
        }

        // Listar cuidadores
        if (method === 'GET' && path.startsWith('/cuidadores')) {
            const cuidadores = await getActiveCuidadores();

            const cuidadoresWithoutPasswords = cuidadores.map(({ senha, _id, ...cuidador }) => cuidador);
            return res.status(200).json({
                success: true,
                cuidadores: cuidadoresWithoutPasswords,
                total: cuidadoresWithoutPasswords.length
            });
        }

        // Buscar usuário específico
        if (method === 'GET' && path.startsWith('/users/')) {
            const userId = path.split('/users/')[1];
            const user = await getUserById(userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            const { senha, _id, ...userWithoutPassword } = user;
            return res.status(200).json({
                success: true,
                user: userWithoutPassword
            });
        }

        // Atualizar usuário
        if (method === 'PUT' && path.startsWith('/users/')) {
            const userId = path.split('/users/')[1];
            
            const updatedUser = await updateUser(userId, req.body);
            
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            const { senha, _id, ...userWithoutPassword } = updatedUser;
            return res.status(200).json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                user: userWithoutPassword
            });
        }

        // Rota não encontrada
        return res.status(404).json({
            success: false,
            message: 'Rota não encontrada',
            debug: {
                path: path,
                method: method,
                url: url
            }
        });

    } catch (error) {
        console.error('Erro na API:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Exporta o handler para o Vercel
module.exports = handler;

// ============================================
// SERVIDOR LOCAL (Desenvolvimento)
// ============================================

// Se não estiver no Vercel, cria um servidor HTTP para desenvolvimento local
if (!process.env.VERCEL) {
    const http = require('http');
    const path = require('path');
    const fs = require('fs');
    
    const PORT = process.env.PORT || 3000;
    
    const server = http.createServer(async (req, res) => {
        const url = req.url;
        
        // Se for requisição para /api/*, chama o handler serverless
        if (url.startsWith('/api/')) {
            // Adiciona headers CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id');
            
            // Responde a preflight OPTIONS
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                return res.end();
            }
            
            // Adiciona métodos compatíveis com Express/Vercel ao res
            if (!res.status) {
                res.status = function(code) {
                    res.statusCode = code;
                    return res;
                };
            }
            
            if (!res.json) {
                res.json = function(data) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return res;
                };
            }
            
            // Parse do body para POST/PUT
            if (req.method === 'POST' || req.method === 'PUT') {
                let body = '';
                
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                
                req.on('end', async () => {
                    try {
                        req.body = JSON.parse(body);
                    } catch (e) {
                        req.body = {};
                    }
                    return await handler(req, res);
                });
            } else {
                return await handler(req, res);
            }
            return;
        }
        
        // Servir arquivos estáticos (HTML, CSS, JS, imagens)
        let filePath = path.join(__dirname, '..', url === '/' ? '/index.html' : url);
        
        // Detectar tipo de arquivo
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };
        
        contentType = mimeTypes[extname] || 'text/plain';
        
        // Ler e enviar arquivo
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 - Página não encontrada</h1>', 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end('Erro interno: ' + error.code, 'utf-8');
                }
            } else {
                res.writeHead(200, { 
                    'Content-Type': contentType,
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(content, 'utf-8');
            }
        });
    });
    
    server.listen(PORT, () => {
        console.log('\n🚀 Servidor LOCAL rodando!');
        console.log(`📍 URL: http://localhost:${PORT}`);
        console.log(`🗄️  Banco: ${USE_MONGODB ? 'MongoDB Atlas ✅' : 'Memória (temporário)'}\n`);
        console.log('📄 Páginas disponíveis:');
        console.log(`   - http://localhost:${PORT}/index.html`);
        console.log(`   - http://localhost:${PORT}/login.html`);
        console.log(`   - http://localhost:${PORT}/cadastro.html`);
        console.log(`   - http://localhost:${PORT}/dashboard.html`);
        console.log(`   - http://localhost:${PORT}/dashboard-admin.html`);
        console.log(`   - http://localhost:${PORT}/buscar-cuidadores.html`);
        console.log(`   - http://localhost:${PORT}/perfil-cuidador.html\n`);
        console.log('⏸️  Pressione Ctrl+C para parar\n');
    });
}

