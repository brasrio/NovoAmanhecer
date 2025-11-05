/**
 * Validação e formatação de telefone - APENAS PORTUGAL
 */

const DDI_PORTUGAL = '+351';

/**
 * Formata telefone adicionando +351 automaticamente
 * @param {string} telefone - Número de telefone
 * @returns {string} - Telefone formatado com DDI
 */
function formatarTelefoneComDDI(telefone) {
    // Remove tudo que não é número
    let numeroLimpo = telefone.replace(/\D/g, '');
    
    // Se já tem DDI +351, retorna
    if (telefone.startsWith('+351')) {
        return telefone;
    }
    
    // Remove +351 se digitado para re-adicionar formatado
    if (numeroLimpo.startsWith('351')) {
        numeroLimpo = numeroLimpo.substring(3);
    }
    
    // Para Portugal: 9 dígitos (9XXXXXXXX)
    // Adiciona +351 automaticamente
    return `${DDI_PORTUGAL}${numeroLimpo}`;
}

/**
 * Valida formato de telefone português
 * @param {string} telefone - Número de telefone
 * @returns {boolean} - True se válido
 */
function validarTelefone(telefone) {
    // Remove tudo que não é número ou +
    const numeroLimpo = telefone.replace(/[^\d+]/g, '');
    
    // Telefone de Portugal: +351 9XXXXXXXX (13 caracteres)
    // Deve começar com +351 e ter 9 como primeiro dígito do número
    if (numeroLimpo.startsWith('+351')) {
        return numeroLimpo.length === 13 && numeroLimpo.substring(4, 5) === '9';
    }
    
    // Se não tem +351, verifica se tem 9 dígitos começando com 9
    if (!numeroLimpo.startsWith('+')) {
        return numeroLimpo.length === 9 && numeroLimpo.startsWith('9');
    }
    
    return false;
}

/**
 * Aplica máscara visual ao telefone português
 * @param {string} telefone - Número de telefone
 * @returns {string} - Telefone com máscara (+351 9XX XXX XXX)
 */
function aplicarMascaraTelefone(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Portugal: +351 9XX XXX XXX
    if (numeroLimpo.length === 9) {
        return numeroLimpo.replace(/(\d{3})(\d{3})(\d{3})/, '+351 $1 $2 $3');
    }
    
    if (telefone.startsWith('+351')) {
        return telefone.replace(/(\+351)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    }
    
    return telefone;
}

/**
 * Configura input de telefone com validação automática
 * @param {HTMLInputElement} inputElement - Elemento input
 * @param {HTMLSelectElement} distritoElement - Elemento select de distrito (opcional)
 */
function configurarInputTelefone(inputElement, distritoElement = null) {
    // Permite apenas números
    inputElement.addEventListener('input', function(e) {
        let valor = e.target.value;
        
        // Mantém apenas números e +
        valor = valor.replace(/[^\d+]/g, '');
        
        // Se não começa com +, não permite + no meio
        if (!valor.startsWith('+') && valor.includes('+')) {
            valor = valor.replace(/\+/g, '');
        }
        
        e.target.value = valor;
    });
    
    // Validação ao sair do campo
    inputElement.addEventListener('blur', function(e) {
        let telefone = e.target.value;
        
        if (telefone && !telefone.startsWith('+351')) {
            // Adiciona +351 automaticamente
            telefone = formatarTelefoneComDDI(telefone);
            e.target.value = telefone;
        }
        
        // Valida formato português
        if (telefone && !validarTelefone(telefone)) {
            e.target.setCustomValidity('Telefone inválido. Use formato: 9XX XXX XXX (Portugal)');
            e.target.reportValidity();
        } else {
            e.target.setCustomValidity('');
        }
    });
    
    // Limpa erro ao digitar
    inputElement.addEventListener('input', function(e) {
        e.target.setCustomValidity('');
    });
}

/**
 * Detecta país baseado no telefone (sempre Portugal)
 * @param {string} telefone - Número de telefone
 * @returns {string} - 'PT'
 */
function detectarPais(telefone) {
    return 'PT'; // Sistema aceita apenas Portugal
}

