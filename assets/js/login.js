/**
 * Cuidar.pt - Login Handler
 * Gerencia autenticação de usuários
 */

'use strict';

// API_URL é importado de config.js - detecta automaticamente localhost vs produção

/**
 * Manipula o envio do formulário de login
 */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const alertDiv = document.getElementById('alertMessage');
    
    // Coleta dados do formulário
    const formData = {
        email: document.getElementById('email').value.trim(),
        senha: document.getElementById('senha').value
    };
    
    // Validação básica
    if (!formData.email || !formData.senha) {
        showAlert('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    // Desabilita botão e mostra loading
    submitButton.disabled = true;
    buttonText.textContent = 'Entrando...';
    alertDiv.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Login bem-sucedido
            showAlert(data.message, 'success');
            
            // Salva dados do usuário no localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Lembrar de mim
            if (document.getElementById('lembrar').checked) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Redireciona baseado no tipo de usuário
            setTimeout(() => {
                const baseURL = window.location.protocol === 'file:' ? 'http://localhost:3000/' : '';
                
                if (data.user.role === 'admin' || data.user.userType === 'admin') {
                    // Admin vai para dashboard completo
                    window.location.href = baseURL + 'dashboard-admin.html';
                } else {
                    // Outros usuários vão para dashboard padrão
                    window.location.href = baseURL + 'dashboard.html';
                }
            }, 1000);
            
        } else {
            // Erro no login
            showAlert(data.message || 'Erro ao fazer login', 'error');
            submitButton.disabled = false;
            buttonText.textContent = 'Entrar';
        }
        
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showAlert('Erro ao conectar com o servidor. Verifique se está rodando.', 'error');
        submitButton.disabled = false;
        buttonText.textContent = 'Entrar';
    }
});

/**
 * Exibe mensagem de alerta
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo do alerta ('success' ou 'error')
 */
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'flex';
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

/**
 * Verifica se usuário já está logado ao carregar a página
 */
window.addEventListener('load', () => {
    // Verifica se está acessando por arquivo local
    if (window.location.protocol === 'file:') {
        alert('⚠️ IMPORTANTE!\n\nPor favor, acesse o sistema pelo servidor:\n\nhttp://localhost:3000/login.html\n\nNão abra os arquivos HTML diretamente!');
        return;
    }
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (isLoggedIn === 'true' && rememberMe === 'true') {
        // Usuário já está logado, redireciona baseado no tipo
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'admin' || user.userType === 'admin') {
            window.location.href = 'dashboard-admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
});

