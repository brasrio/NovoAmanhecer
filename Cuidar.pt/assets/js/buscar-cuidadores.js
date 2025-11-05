/**
 * Cuidar.pt - Busca de Cuidadores
 * Sistema de busca e filtros para clientes encontrarem cuidadores
 */

'use strict';

// API_URL é importado de config.js - detecta automaticamente localhost vs produção
let cuidadoresData = [];
let cuidadoresFiltrados = [];

/**
 * Logout
 */
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

/**
 * Verifica se usuário está logado
 */
function verificarAutenticacao() {
    // Verifica se está acessando por arquivo local
    if (window.location.protocol === 'file:') {
        alert('⚠️ IMPORTANTE!\n\nPor favor, acesse o sistema pelo servidor:\n\nhttp://localhost:3000\n\nNão abra os arquivos HTML diretamente!');
        // Tenta redirecionar
        if (confirm('Deseja ser redirecionado agora?')) {
            window.location.href = 'http://localhost:3000/buscar-cuidadores.html';
        }
        return {};
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        // Permite acesso público, mas mostra aviso
        showAlert('💡 Faça login para solicitar serviços', 'info');
    }
    
    return user;
}

/**
 * Carrega opções dos filtros
 */
async function carregarFiltros() {
    try {
        // Carrega todos os cuidadores para extrair cidades e qualificações únicas
        const response = await fetch(`${API_URL}/cuidadores`);
        const data = await response.json();
        
        if (data.success && data.cuidadores) {
            const cuidadores = data.cuidadores;
            
            // Extrai cidades únicas
            const cidades = new Set();
            const qualificacoes = new Set();
            
            cuidadores.forEach(c => {
                if (c.areasAtuacao && Array.isArray(c.areasAtuacao)) {
                    c.areasAtuacao.forEach(cidade => cidades.add(cidade));
                }
                if (c.qualificacoes && Array.isArray(c.qualificacoes)) {
                    c.qualificacoes.forEach(qual => qualificacoes.add(qual));
                }
            });
            
            // Popula select de cidades
            const selectCidade = document.getElementById('filtroCidade');
            Array.from(cidades).sort().forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade;
                option.textContent = cidade;
                selectCidade.appendChild(option);
            });
            
            // Popula select de qualificações
            const selectQual = document.getElementById('filtroQualificacao');
            Array.from(qualificacoes).sort().forEach(qual => {
                const option = document.createElement('option');
                option.value = qual;
                option.textContent = qual;
                selectQual.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar filtros:', error);
    }
}

/**
 * Busca cuidadores
 */
async function buscarCuidadores() {
    const cidade = document.getElementById('filtroCidade').value;
    const valorMax = document.getElementById('filtroValor').value;
    const dia = document.getElementById('filtroDia').value;
    const qualificacao = document.getElementById('filtroQualificacao').value;
    
    // Mostra loading
    document.getElementById('resultadosSection').style.display = 'block';
    document.getElementById('loadingResults').style.display = 'block';
    document.getElementById('cuidadoresGrid').innerHTML = '';
    document.getElementById('emptyState').style.display = 'none';
    
    try {
        // Monta URL com filtros
        let url = `${API_URL}/cuidadores?`;
        if (cidade) url += `cidade=${encodeURIComponent(cidade)}&`;
        if (valorMax) url += `valorMax=${valorMax}&`;
        if (dia) url += `dia=${encodeURIComponent(dia)}&`;
        if (qualificacao) url += `qualificacao=${encodeURIComponent(qualificacao)}&`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        document.getElementById('loadingResults').style.display = 'none';
        
        if (data.success && data.cuidadores) {
            cuidadoresData = data.cuidadores;
            cuidadoresFiltrados = [...cuidadoresData];
            
            // Aplica ordenação padrão
            ordenarResultados();
            
            if (cuidadoresData.length === 0) {
                document.getElementById('emptyState').style.display = 'block';
            }
        } else {
            showAlert('Erro ao buscar cuidadores', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('loadingResults').style.display = 'none';
        showAlert('Erro ao conectar com o servidor', 'error');
    }
}

/**
 * Ordena resultados
 */
function ordenarResultados() {
    const criterio = document.getElementById('ordenarPor').value;
    
    switch(criterio) {
        case 'menor-preco':
            cuidadoresFiltrados.sort((a, b) => (a.valorHora || 999) - (b.valorHora || 999));
            break;
        case 'maior-preco':
            cuidadoresFiltrados.sort((a, b) => (b.valorHora || 0) - (a.valorHora || 0));
            break;
        case 'mais-experiencia':
            cuidadoresFiltrados.sort((a, b) => (b.experiencia || 0) - (a.experiencia || 0));
            break;
        default: // relevancia
            // Ordena por completude do perfil (mais completo = mais relevante)
            cuidadoresFiltrados.sort((a, b) => {
                const scoreA = calcularScore(a);
                const scoreB = calcularScore(b);
                return scoreB - scoreA;
            });
    }
    
    renderizarCuidadores();
}

/**
 * Calcula score de relevância
 */
function calcularScore(cuidador) {
    let score = 0;
    if (cuidador.fotoPerfil) score += 2;
    if (cuidador.descricao) score += 1;
    if (cuidador.valorHora) score += 1;
    if (cuidador.experiencia) score += 1;
    if (cuidador.areasAtuacao && cuidador.areasAtuacao.length > 0) score += 2;
    if (cuidador.qualificacoes && cuidador.qualificacoes.length > 0) score += cuidador.qualificacoes.length;
    if (cuidador.disponibilidade && cuidador.disponibilidade.length > 0) score += cuidador.disponibilidade.length;
    return score;
}

/**
 * Renderiza cards de cuidadores
 */
function renderizarCuidadores() {
    const grid = document.getElementById('cuidadoresGrid');
    const total = document.getElementById('totalResultados');
    
    total.textContent = cuidadoresFiltrados.length;
    
    if (cuidadoresFiltrados.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        grid.innerHTML = '';
        return;
    }
    
    document.getElementById('emptyState').style.display = 'none';
    
    grid.innerHTML = cuidadoresFiltrados.map(cuidador => criarCardCuidador(cuidador)).join('');
}

/**
 * Cria card de cuidador
 */
function criarCardCuidador(cuidador) {
    const foto = cuidador.fotoPerfil ? 
        `<img src="${cuidador.fotoPerfil}" alt="${cuidador.nome}">` : 
        '👨‍⚕️';
    
    const valor = cuidador.valorHora ? 
        `<div class="cuidador-valor">
            <div class="valor-numero">€${cuidador.valorHora.toFixed(2)}</div>
            <div class="valor-label">por hora</div>
        </div>` : 
        `<div class="cuidador-valor">
            <div class="valor-label">Valor a combinar</div>
        </div>`;
    
    const experiencia = cuidador.experiencia ? 
        `<div class="detalhe-item">
            <span>⏱️</span>
            <span>${cuidador.experiencia} ${cuidador.experiencia === 1 ? 'ano' : 'anos'} de experiência</span>
        </div>` : '';
    
    const areas = cuidador.areasAtuacao && cuidador.areasAtuacao.length > 0 ?
        `<div class="detalhe-item">
            <span>📍</span>
            <span>${cuidador.areasAtuacao.slice(0, 3).join(', ')}${cuidador.areasAtuacao.length > 3 ? '...' : ''}</span>
        </div>` : '';
    
    const qualificacoes = cuidador.qualificacoes && cuidador.qualificacoes.length > 0 ?
        `<div class="detalhe-item">
            <span>🎓</span>
            <div>
                <div>${cuidador.qualificacoes.length} qualificação(ões)</div>
                <div class="qualificacoes-mini">
                    ${cuidador.qualificacoes.slice(0, 3).map(q => 
                        `<span class="tag-mini">${q}</span>`
                    ).join('')}
                    ${cuidador.qualificacoes.length > 3 ? '<span class="tag-mini">...</span>' : ''}
                </div>
            </div>
        </div>` : '';
    
    const disponibilidade = cuidador.disponibilidade && cuidador.disponibilidade.length > 0 ?
        `<span class="disponibilidade-badge">
            📅 Disponível ${cuidador.disponibilidade.length} dia(s)/semana
        </span>` : '';
    
    const descricao = cuidador.descricao ? 
        `<div class="detalhe-item">
            <span>💬</span>
            <span>${cuidador.descricao.substring(0, 100)}${cuidador.descricao.length > 100 ? '...' : ''}</span>
        </div>` : '';
    
    return `
        <div class="cuidador-card">
            <div class="cuidador-header">
                <div class="cuidador-foto">
                    ${foto}
                </div>
                <div class="cuidador-info-header">
                    <div class="cuidador-nome">${cuidador.nome}</div>
                    <span class="cuidador-badge">👨‍⚕️ Cuidador Profissional</span>
                    ${disponibilidade}
                </div>
            </div>
            
            ${valor}
            
            <div class="cuidador-detalhes">
                ${descricao}
                ${experiencia}
                ${areas}
                ${qualificacoes}
            </div>
            
            <div class="cuidador-actions">
                <button class="btn-action btn-ver-perfil" onclick="verPerfilCompleto('${cuidador.id}')">
                    👁️ Ver Perfil
                </button>
                <button class="btn-action btn-solicitar" onclick="solicitarServico('${cuidador.id}')">
                    ✉️ Solicitar
                </button>
            </div>
        </div>
    `;
}

/**
 * Ver perfil completo do cuidador
 */
function verPerfilCompleto(cuidadorId) {
    const cuidador = cuidadoresData.find(c => c.id === cuidadorId);
    
    if (!cuidador) return;
    
    // Cria modal com perfil completo
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
        overflow-y: auto;
    `;
    
    const foto = cuidador.fotoPerfil ? 
        `<img src="${cuidador.fotoPerfil}" alt="${cuidador.nome}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover;">` : 
        '<div style="width: 150px; height: 150px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: white;">👨‍⚕️</div>';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 3rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                ${foto}
                <h2 style="color: #1e3a5f; margin-top: 1rem;">${cuidador.nome}</h2>
                <span style="background: #3abebd; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold;">👨‍⚕️ Cuidador Profissional</span>
            </div>
            
            ${cuidador.valorHora ? `
            <div style="background: #e8f8f8; padding: 1.5rem; border-radius: 12px; text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 2.5rem; font-weight: bold; color: #3abebd;">€${cuidador.valorHora.toFixed(2)}</div>
                <div style="color: #5a7184;">por hora</div>
            </div>
            ` : ''}
            
            ${cuidador.descricao ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #1e3a5f; margin-bottom: 0.5rem;">💬 Sobre</h3>
                <p style="color: #5a7184; line-height: 1.6;">${cuidador.descricao}</p>
            </div>
            ` : ''}
            
            ${cuidador.experiencia ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #1e3a5f; margin-bottom: 0.5rem;">⏱️ Experiência</h3>
                <p style="color: #5a7184;">${cuidador.experiencia} ${cuidador.experiencia === 1 ? 'ano' : 'anos'} atuando na área</p>
            </div>
            ` : ''}
            
            ${cuidador.areasAtuacao && cuidador.areasAtuacao.length > 0 ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #1e3a5f; margin-bottom: 0.5rem;">📍 Áreas de Atuação</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${cuidador.areasAtuacao.map(area => 
                        `<span style="background: #f0f0f0; color: #5a7184; padding: 0.5rem 1rem; border-radius: 20px;">${area}</span>`
                    ).join('')}
                </div>
            </div>
            ` : ''}
            
            ${cuidador.qualificacoes && cuidador.qualificacoes.length > 0 ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #1e3a5f; margin-bottom: 0.5rem;">🎓 Qualificações</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${cuidador.qualificacoes.map(qual => 
                        `<span style="background: #3abebd; color: white; padding: 0.5rem 1rem; border-radius: 20px;">${qual}</span>`
                    ).join('')}
                </div>
            </div>
            ` : ''}
            
            ${cuidador.disponibilidade && cuidador.disponibilidade.length > 0 ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="color: #1e3a5f; margin-bottom: 0.5rem;">📅 Disponibilidade</h3>
                ${cuidador.disponibilidade.map(disp => `
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem;">
                        <strong style="color: #1e3a5f;">${disp.dia}</strong><br>
                        <span style="color: #5a7184;">⏰ ${disp.horarios.join(', ')}</span>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button onclick="this.closest('[style*=\\'position: fixed\\']').remove()" 
                    style="flex: 1; padding: 1rem; background: #5a7184; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    Fechar
                </button>
                <button onclick="solicitarServico('${cuidador.id}')" 
                    style="flex: 1; padding: 1rem; background: #3abebd; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    ✉️ Solicitar Serviço
                </button>
            </div>
        </div>
    `;
    
    // Fecha ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    document.body.appendChild(modal);
}

/**
 * Solicitar serviço do cuidador
 */
function solicitarServico(cuidadorId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!localStorage.getItem('isLoggedIn')) {
        alert('⚠️ Você precisa fazer login para solicitar serviços!\n\nFaça login ou cadastre-se.');
        window.location.href = 'login.html';
        return;
    }
    
    const cuidador = cuidadoresData.find(c => c.id === cuidadorId);
    
    if (!cuidador) return;
    
    // Por enquanto, mostra confirmação
    // Futuramente, criar sistema de solicitações no backend
    const confirmacao = confirm(
        `📧 Solicitar serviço de ${cuidador.nome}?\n\n` +
        `${cuidador.valorHora ? `Valor: €${cuidador.valorHora}/hora\n` : ''}` +
        `Email: ${cuidador.email}\n` +
        `Telefone: ${cuidador.telefone || 'Não informado'}\n\n` +
        `Por enquanto, entre em contato diretamente.\n` +
        `Em breve teremos sistema automático de solicitações!`
    );
    
    if (confirmacao) {
        showAlert(`✅ Dados de contato: ${cuidador.email} | ${cuidador.telefone || 'Não informado'}`, 'info');
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
    verificarAutenticacao();
    carregarFiltros();
    
    // Busca automática inicial (todos os cuidadores)
    buscarCuidadores();
});

