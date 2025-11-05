/**
 * Cuidar.pt - Perfil do Cuidador
 * Gerencia o perfil profissional do cuidador
 */

'use strict';

// API_URL é importado de config.js - detecta automaticamente localhost vs produção
let qualificacoes = [];
let fotoBase64 = null;

/**
 * Dias da semana
 */
const DIAS_SEMANA = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
];

/**
 * Principais cidades de Portugal
 */
const CIDADES_PORTUGAL = [
    'Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro',
    'Aveiro', 'Setúbal', 'Évora', 'Viseu', 'Leiria',
    'Vila Nova de Gaia', 'Matosinhos', 'Cascais', 'Sintra', 'Oeiras'
];

/**
 * Logout
 */
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

/**
 * Verifica se usuário está logado e é cuidador
 */
function verificarAutenticacao() {
    // Verifica se está acessando por arquivo local
    if (window.location.protocol === 'file:') {
        alert('⚠️ IMPORTANTE!\n\nPor favor, acesse o sistema pelo servidor:\n\nhttp://localhost:3000/login.html\n\nNão abra os arquivos HTML diretamente!');
        return null;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        alert('Você precisa fazer login primeiro!');
        window.location.href = 'login.html';
        return null;
    }
    
    if (user.role !== 'cuidador' && user.userType !== 'cuidador') {
        alert('Esta página é apenas para cuidadores!');
        window.location.href = 'dashboard.html';
        return null;
    }
    
    return user;
}

/**
 * Carrega áreas de atuação
 */
function carregarAreasAtuacao() {
    const container = document.getElementById('areasAtuacao');
    
    CIDADES_PORTUGAL.forEach(cidade => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="area_${cidade}" name="areas" value="${cidade}">
            <label for="area_${cidade}">${cidade}</label>
        `;
        container.appendChild(div);
    });
}

/**
 * Carrega horários de disponibilidade
 */
function carregarHorarios() {
    const container = document.getElementById('horariosDisponibilidade');
    
    DIAS_SEMANA.forEach((dia, index) => {
        const div = document.createElement('div');
        div.className = 'horario-dia';
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="checkbox" id="dia_${index}" data-dia="${dia}">
                <h4 style="margin: 0;">${dia}</h4>
            </div>
            <div class="horario-inputs" id="horarios_${index}" style="display: none;">
                <input type="time" id="inicio_${index}" placeholder="Início">
                <input type="time" id="fim_${index}" placeholder="Fim">
            </div>
        `;
        container.appendChild(div);
        
        // Evento para mostrar/ocultar horários
        const checkbox = div.querySelector(`#dia_${index}`);
        const horariosDiv = div.querySelector(`#horarios_${index}`);
        
        checkbox.addEventListener('change', (e) => {
            horariosDiv.style.display = e.target.checked ? 'grid' : 'none';
        });
    });
}

/**
 * Preview da foto
 */
document.addEventListener('DOMContentLoaded', () => {
    const fotoInput = document.getElementById('fotoPerfil');
    const fotoPreview = document.getElementById('fotoPreview');
    
    if (fotoInput) {
        fotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            if (file) {
                // Verifica tamanho (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    showAlert('Imagem muito grande! Máximo 2MB.', 'error');
                    fotoInput.value = '';
                    return;
                }
                
                // Verifica tipo
                if (!file.type.startsWith('image/')) {
                    showAlert('Arquivo inválido! Apenas imagens.', 'error');
                    fotoInput.value = '';
                    return;
                }
                
                // Converte para base64 e mostra preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    fotoBase64 = event.target.result;
                    fotoPreview.innerHTML = `<img src="${fotoBase64}" alt="Foto de perfil">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

/**
 * Adiciona qualificação
 */
function adicionarQualificacao() {
    const input = document.getElementById('novaQualificacao');
    const valor = input.value.trim();
    
    if (!valor) {
        showAlert('Digite uma qualificação', 'error');
        return;
    }
    
    if (qualificacoes.includes(valor)) {
        showAlert('Qualificação já adicionada', 'error');
        return;
    }
    
    qualificacoes.push(valor);
    input.value = '';
    renderizarQualificacoes();
}

/**
 * Remove qualificação
 */
function removerQualificacao(index) {
    qualificacoes.splice(index, 1);
    renderizarQualificacoes();
}

/**
 * Renderiza tags de qualificações
 */
function renderizarQualificacoes() {
    const container = document.getElementById('qualificacoesList');
    
    if (qualificacoes.length === 0) {
        container.innerHTML = '<p style="color: #5a7184;">Nenhuma qualificação adicionada ainda.</p>';
        return;
    }
    
    container.innerHTML = qualificacoes.map((qual, index) => `
        <div class="tag">
            <span>${qual}</span>
            <button type="button" onclick="removerQualificacao(${index})">&times;</button>
        </div>
    `).join('');
}

/**
 * Carrega dados do perfil
 */
async function carregarPerfil() {
    const user = verificarAutenticacao();
    if (!user) return;
    
    try {
        const response = await fetch(`${API_URL}/users/${user.id}`, {
            headers: {
                'x-user-id': user.id
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.user) {
            const perfil = data.user;
            
            // Preenche campos básicos
            if (perfil.descricao) document.getElementById('descricao').value = perfil.descricao;
            if (perfil.experiencia) document.getElementById('experiencia').value = perfil.experiencia;
            if (perfil.valorHora) document.getElementById('valorHora').value = perfil.valorHora;
            
            // Foto de perfil
            if (perfil.fotoPerfil) {
                fotoBase64 = perfil.fotoPerfil;
                document.getElementById('fotoPreview').innerHTML = `<img src="${perfil.fotoPerfil}" alt="Foto de perfil">`;
            }
            
            // Áreas de atuação
            if (perfil.areasAtuacao && Array.isArray(perfil.areasAtuacao)) {
                perfil.areasAtuacao.forEach(area => {
                    const checkbox = document.getElementById(`area_${area}`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            
            // Qualificações
            if (perfil.qualificacoes && Array.isArray(perfil.qualificacoes)) {
                qualificacoes = [...perfil.qualificacoes];
                renderizarQualificacoes();
            }
            
            // Disponibilidade
            if (perfil.disponibilidade && Array.isArray(perfil.disponibilidade)) {
                perfil.disponibilidade.forEach(disp => {
                    const index = DIAS_SEMANA.indexOf(disp.dia);
                    if (index !== -1) {
                        const checkbox = document.getElementById(`dia_${index}`);
                        const horariosDiv = document.getElementById(`horarios_${index}`);
                        const inicioInput = document.getElementById(`inicio_${index}`);
                        const fimInput = document.getElementById(`fim_${index}`);
                        
                        if (checkbox) {
                            checkbox.checked = true;
                            horariosDiv.style.display = 'grid';
                            if (disp.horarios && disp.horarios.length > 0) {
                                const horario = disp.horarios[0].split('-');
                                inicioInput.value = horario[0];
                                fimInput.value = horario[1];
                            }
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        showAlert('Erro ao carregar perfil. Tente novamente.', 'error');
    }
}

/**
 * Salva perfil
 */
async function salvarPerfil(e) {
    e.preventDefault();
    
    const user = verificarAutenticacao();
    if (!user) return;
    
    // Coleta dados do formulário
    const descricao = document.getElementById('descricao').value.trim();
    const experiencia = document.getElementById('experiencia').value;
    const valorHora = document.getElementById('valorHora').value;
    
    // Coleta áreas de atuação
    const areasCheckboxes = document.querySelectorAll('input[name="areas"]:checked');
    const areasAtuacao = Array.from(areasCheckboxes).map(cb => cb.value);
    
    // Coleta disponibilidade
    const disponibilidade = [];
    DIAS_SEMANA.forEach((dia, index) => {
        const checkbox = document.getElementById(`dia_${index}`);
        if (checkbox && checkbox.checked) {
            const inicio = document.getElementById(`inicio_${index}`).value;
            const fim = document.getElementById(`fim_${index}`).value;
            
            if (inicio && fim) {
                disponibilidade.push({
                    dia: dia,
                    horarios: [`${inicio}-${fim}`]
                });
            }
        }
    });
    
    // Validações básicas
    if (!valorHora || valorHora <= 0) {
        showAlert('Por favor, defina um valor por hora válido.', 'error');
        return;
    }
    
    if (areasAtuacao.length === 0) {
        showAlert('Selecione pelo menos uma área de atuação.', 'error');
        return;
    }
    
    if (disponibilidade.length === 0) {
        showAlert('Defina pelo menos um dia de disponibilidade.', 'error');
        return;
    }
    
    // Monta objeto de perfil
    const perfilData = {
        descricao,
        experiencia: experiencia ? parseInt(experiencia) : 0,
        valorHora: parseFloat(valorHora),
        fotoPerfil: fotoBase64,
        areasAtuacao,
        qualificacoes,
        disponibilidade
    };
    
    // Envia para backend
    try {
        const response = await fetch(`${API_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': user.id
            },
            body: JSON.stringify(perfilData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('✅ Perfil salvo com sucesso!', 'success');
            
            // Atualiza localStorage
            const updatedUser = { ...user, ...perfilData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Redireciona após 2 segundos
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            showAlert('❌ ' + (data.message || 'Erro ao salvar perfil'), 'error');
        }
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        showAlert('❌ Erro ao conectar com o servidor', 'error');
    }
}

/**
 * Mostra alerta
 */
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Inicializa a página
 */
window.addEventListener('load', () => {
    const user = verificarAutenticacao();
    if (!user) return;
    
    carregarAreasAtuacao();
    carregarHorarios();
    renderizarQualificacoes();
    carregarPerfil();
    
    // Event listener do formulário
    document.getElementById('perfilForm').addEventListener('submit', salvarPerfil);
});

