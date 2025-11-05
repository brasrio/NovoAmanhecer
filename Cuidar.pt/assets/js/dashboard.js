/**
 * Cuidar.pt - Dashboard Handler
 * Gerencia o painel do usuário
 */

'use strict';

/**
 * Carrega informações do usuário ao iniciar a página
 */
function loadUserData() {
    // Verifica se está acessando por arquivo local
    if (window.location.protocol === 'file:') {
        alert('⚠️ IMPORTANTE!\n\nPor favor, acesse o sistema pelo servidor:\n\nhttp://localhost:3000/login.html\n\nNão abra os arquivos HTML diretamente!');
        return;
    }
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userStr = localStorage.getItem('user');
    
    // Verifica se está logado
    if (isLoggedIn !== 'true' || !userStr) {
        alert('Você precisa fazer login primeiro!');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const user = JSON.parse(userStr);
        
        // Atualiza informações na página
        document.getElementById('userName').textContent = user.nome.split(' ')[0];
        document.getElementById('infoNome').textContent = user.nome;
        document.getElementById('infoEmail').textContent = user.email;
        document.getElementById('infoTelefone').textContent = user.telefone || '-';
        
        // Mostra distrito e cidade
        const cidadeCompleta = user.distrito && user.cidade 
            ? `${user.cidade}, ${user.distrito}` 
            : (user.cidade || '-');
        document.getElementById('infoCidade').textContent = cidadeCompleta;
        
        // Formata data de cadastro
        if (user.createdAt) {
            const date = new Date(user.createdAt);
            document.getElementById('infoData').textContent = date.toLocaleDateString('pt-BR');
        }
        
        // Badge de tipo de usuário
        const userTypeBadge = document.getElementById('userTypeBadge');
        if (user.userType === 'admin' || user.role === 'admin') {
            userTypeBadge.textContent = '👑 Administrador';
        } else if (user.userType === 'cuidador' || user.role === 'cuidador') {
            userTypeBadge.textContent = '👨‍⚕️ Cuidador Profissional';
        } else {
            userTypeBadge.textContent = '👤 Familiar';
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        logout();
    }
}

/**
 * Faz logout do usuário
 */
function logout() {
    // Limpa dados da sessão
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('rememberMe');
    
    // Redireciona para login
    window.location.href = 'login.html';
}

/**
 * Carrega funcionalidades específicas por tipo de usuário
 */
function loadUserSpecificFeatures(user) {
    console.log('📦 loadUserSpecificFeatures chamada para:', user);
    
    const actionsCard = document.querySelector('.dashboard-card:nth-child(2)');
    
    if (!actionsCard) {
        console.error('❌ Card de ações não encontrado!');
        return;
    }
    
    console.log('✅ Card de ações encontrado');
    
    // Atualiza conteúdo baseado no tipo de usuário
    if (user.role === 'admin' || user.userType === 'admin') {
        console.log('👑 Carregando painel ADMIN...');
        // Admin: Mostrar painel administrativo
        actionsCard.innerHTML = `
            <h2>🔧 Painel Administrativo</h2>
            <p>Como administrador, você pode:</p>
            <ul style="color: #5a7184; line-height: 2;">
                <li><a href="dashboard-admin.html" class="link" style="font-weight: bold; color: #9b59b6;">👑 Gerenciar Todos os Usuários</a></li>
                <li><a href="#" onclick="listarCuidadores()" class="link">Ver cuidadores</a></li>
                <li><a href="cadastro.html" class="link">Cadastrar novo usuário</a></li>
            </ul>
        `;
    } else if (user.role === 'cuidador' || user.userType === 'cuidador') {
        console.log('👨‍⚕️ Carregando painel CUIDADOR...');
        // Cuidador: Mostrar ações de profissional
        actionsCard.innerHTML = `
            <h2>⚡ Ações Profissionais</h2>
            <p>Como cuidador, você pode:</p>
            <ul style="color: #5a7184; line-height: 2;">
                <li><a href="perfil-cuidador.html" class="link" style="font-weight: bold; color: #3abebd;">👨‍⚕️ Completar Perfil Profissional</a></li>
                <li>Definir valor por hora e áreas de atuação</li>
                <li>Gerenciar disponibilidade (dias/horários)</li>
                <li>Adicionar foto e qualificações</li>
            </ul>
            <p style="margin-top: 1rem; color: #28a745; font-weight: bold;">
                ✅ Comece completando seu perfil!
            </p>
        `;
    } else {
        console.log('👤 Carregando painel CLIENTE/FAMILIAR...');
        // Cliente: Mostrar busca de cuidadores
        actionsCard.innerHTML = `
            <h2>⚡ Ações Rápidas</h2>
            <p>Como cliente, você pode:</p>
            <ul style="color: #5a7184; line-height: 2;">
                <li><a href="buscar-cuidadores.html" class="link" style="font-weight: bold; color: #3abebd;">🔍 Buscar Cuidadores</a></li>
                <li>Filtrar por localização, valor e disponibilidade</li>
                <li>Ver perfis completos dos cuidadores</li>
                <li>Solicitar serviços diretamente</li>
            </ul>
            <p style="margin-top: 1rem; color: #28a745; font-weight: bold;">
                ✅ Sistema de busca está pronto!
            </p>
        `;
    }
}

/**
 * Lista todos os usuários (admin only)
 */
async function listarTodosUsuarios() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
        const response = await fetch('http://localhost:3000/api/users', {
            headers: {
                'x-user-id': user.id
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Usuários cadastrados:', data.users);
            alert(`Total de usuários: ${data.users.length}\n\nVeja o console (F12) para detalhes.`);
        } else {
            alert('Erro: ' + data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar usuários');
    }
}

/**
 * Lista cuidadores
 */
async function listarCuidadores() {
    try {
        const response = await fetch('http://localhost:3000/api/cuidadores');
        const data = await response.json();
        
        if (data.success) {
            console.log('Cuidadores:', data.cuidadores);
            alert(`Total de cuidadores: ${data.cuidadores.length}\n\nVeja o console (F12) para detalhes.`);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

/**
 * Buscar cuidadores (para clientes)
 */
async function buscarCuidadores() {
    const cidade = prompt('Digite a cidade (ou deixe em branco para ver todos):');
    
    try {
        const url = cidade 
            ? `http://localhost:3000/api/cuidadores?cidade=${encodeURIComponent(cidade)}`
            : 'http://localhost:3000/api/cuidadores';
            
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            console.log('Cuidadores encontrados:', data.cuidadores);
            
            if (data.cuidadores.length === 0) {
                alert('Nenhum cuidador encontrado nesta localização.');
            } else {
                alert(`${data.cuidadores.length} cuidador(es) encontrado(s)!\n\nVeja o console (F12) para detalhes.`);
            }
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar cuidadores');
    }
}

/**
 * Inicializa o dashboard
 */
function initDashboard() {
    console.log('🚀 Iniciando dashboard...');
    
    // Carrega dados do usuário
    loadUserData();
    
    // Carrega funcionalidades específicas
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        console.log('👤 Tipo de usuário:', user.role || user.userType);
        loadUserSpecificFeatures(user);
    } else {
        console.error('❌ Nenhum usuário encontrado no localStorage');
    }
    
    // Adiciona event listener no botão de logout do menu
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Adiciona event listener no botão de logout da dashboard
    const btnLogoutDashboard = document.querySelector('.dashboard-actions .btn-logout');
    if (btnLogoutDashboard) {
        btnLogoutDashboard.addEventListener('click', logout);
    }
    
    console.log('✅ Dashboard inicializado!');
}

// Não inicializa automaticamente aqui - será chamado pelo HTML
// para evitar conflito de timing

