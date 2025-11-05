/**
 * Cuidar.pt - Cadastro JavaScript
 * Gerencia o formulário de cadastro e envio de dados
 */

'use strict';

// =============================================================================
// CONFIGURAÇÃO
// =============================================================================

// API_URL é importado de config.js - detecta automaticamente localhost vs produção

// =============================================================================
// SELETOR DE TIPO DE USUÁRIO
// =============================================================================

/**
 * Inicializa os botões de seleção de tipo de usuário
 */
const initUserTypeSelector = () => {
    const userTypeBtns = document.querySelectorAll('.user-type-btn');
    const userTypeInput = document.getElementById('userType');
    
    // Verifica se há tipo na URL
    const urlParams = new URLSearchParams(window.location.search);
    const tipoUrl = urlParams.get('tipo');
    
    if (tipoUrl) {
        userTypeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === tipoUrl) {
                btn.classList.add('active');
                userTypeInput.value = tipoUrl;
            }
        });
    }
    
    userTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active de todos
            userTypeBtns.forEach(b => b.classList.remove('active'));
            // Adiciona active no clicado
            btn.classList.add('active');
            // Atualiza o input hidden
            userTypeInput.value = btn.dataset.type;
        });
    });
};

// =============================================================================
// VALIDAÇÃO DO FORMULÁRIO
// =============================================================================

/**
 * Valida email
 * @param {string} email - Email para validar
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Valida telefone português (APENAS Portugal +351)
 * @param {string} telefone - Telefone para validar
 * @returns {boolean}
 */
const isValidPhone = (telefone) => {
    // Remove espaços
    const numeroLimpo = telefone.replace(/\s/g, '');
    
    // Aceita: +351912345678 (13 chars) ou 912345678 (9 chars começando com 9)
    if (numeroLimpo.startsWith('+351')) {
        return numeroLimpo.length === 13 && numeroLimpo.charAt(4) === '9';
    }
    
    // Sem +351: deve ter 9 dígitos começando com 9
    return /^9[0-9]{8}$/.test(numeroLimpo);
};

/**
 * Valida o formulário
 * @param {FormData} formData - Dados do formulário
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
const validateForm = (formData) => {
    const errors = [];
    
    const nome = formData.get('nome').trim();
    const email = formData.get('email').trim();
    const telefone = formData.get('telefone').trim();
    const cidade = formData.get('cidade').trim();
    const termos = formData.get('termos');
    
    if (!nome || nome.length < 3) {
        errors.push('Nome deve ter pelo menos 3 caracteres');
    }
    
    if (!isValidEmail(email)) {
        errors.push('Email inválido');
    }
    
    if (!isValidPhone(telefone)) {
        errors.push('Telefone inválido');
    }
    
    if (!cidade || cidade.length < 2) {
        errors.push('Cidade inválida');
    }
    
    if (!termos) {
        errors.push('Você deve aceitar os termos de uso');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};

// =============================================================================
// ALERTAS
// =============================================================================

/**
 * Mostra um alerta
 * @param {string} message - Mensagem do alerta
 * @param {string} type - Tipo: 'success' ou 'error'
 */
const showAlert = (message, type = 'success') => {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'flex';
    
    // Scroll suave para o alerta
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remove após 5 segundos se for sucesso
    if (type === 'success') {
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    }
};

/**
 * Esconde o alerta
 */
const hideAlert = () => {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.style.display = 'none';
};

// =============================================================================
// GERAÇÃO DE SENHA
// =============================================================================

/**
 * Gera uma senha aleatória segura
 * @param {number} length - Tamanho da senha (padrão: 12)
 * @returns {string} - Senha gerada
 */
const generatePassword = (length = 12) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%&*';
    
    const allChars = uppercase + lowercase + numbers + symbols;
    let password = '';
    
    // Garante pelo menos um de cada tipo
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Completa o resto
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Embaralha a senha
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

// =============================================================================
// ENVIO DO FORMULÁRIO
// =============================================================================

/**
 * Envia o formulário de cadastro
 * @param {Event} e - Evento de submit
 */
const handleSubmit = async (e) => {
    e.preventDefault();
    
    hideAlert();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Valida o formulário
    const validation = validateForm(formData);
    if (!validation.valid) {
        showAlert(validation.errors.join(', '), 'error');
        return;
    }
    
    // Desabilita o botão e mostra loader
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    
    try {
        // Gera a senha
        const senha = generatePassword();
        
        // Prepara os dados
        const userData = {
            nome: formData.get('nome').trim(),
            email: formData.get('email').trim(),
            telefone: formData.get('telefone').trim(),
            distrito: formData.get('distrito'),
            cidade: formData.get('cidade'),
            userType: formData.get('userType'),
            senha: senha
        };
        
        // Envia para o backend
        const response = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('Cadastro realizado com sucesso! Verifique seu email para acessar sua senha.', 'success');
            form.reset();
            
            // Redireciona após 3 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        } else {
            throw new Error(result.message || 'Erro ao realizar cadastro');
        }
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        showAlert(error.message || 'Erro ao realizar cadastro. Tente novamente.', 'error');
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
};

// =============================================================================
// INICIALIZAÇÃO
// =============================================================================

/**
 * Inicializa dropdowns de localização
 */
const initLocalizacoes = () => {
    const distritoSelect = document.getElementById('distrito');
    const cidadeSelect = document.getElementById('cidade');
    
    if (!distritoSelect || !cidadeSelect) return;
    
    // Popula dropdown de distritos
    popularDistritosDropdown(distritoSelect);
    
    // Quando selecionar distrito, popula cidades
    distritoSelect.addEventListener('change', function() {
        const distritoSelecionado = this.value;
        
        if (distritoSelecionado) {
            popularCidadesDropdown(cidadeSelect, distritoSelecionado);
        } else {
            cidadeSelect.innerHTML = '<option value="">Selecione primeiro o distrito</option>';
            cidadeSelect.disabled = true;
        }
    });
};

/**
 * Inicializa validação de telefone
 */
const initTelefoneValidation = () => {
    const telefoneInput = document.getElementById('telefone');
    const distritoSelect = document.getElementById('distrito');
    
    if (!telefoneInput) return;
    
    configurarInputTelefone(telefoneInput, distritoSelect);
};

/**
 * Inicializa a página de cadastro
 */
const initCadastro = () => {
    initUserTypeSelector();
    initLocalizacoes();
    initTelefoneValidation();
    
    const form = document.getElementById('cadastroForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
};

// Aguarda o DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCadastro);
} else {
    initCadastro();
}

