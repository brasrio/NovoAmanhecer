/**
 * Configuração de API - Detecta automaticamente o ambiente
 */

// Detecta se está em produção (Vercel) ou desenvolvimento (localhost)
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1' &&
                     !window.location.hostname.includes('192.168');

// URL base da API
const API_BASE_URL = isProduction 
    ? 'https://cuidar-pt.vercel.app/api'  // Produção no Vercel
    : 'http://localhost:3000/api';         // Desenvolvimento local

// Exporta a configuração
const API_URL = API_BASE_URL;

// Log para debug (remover em produção se quiser)
console.log('🌍 Ambiente:', isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO');
console.log('🔗 API URL:', API_URL);

