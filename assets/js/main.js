/**
 * Cuidar.pt - Main JavaScript
 * Handles smooth scrolling, animations, and user interactions
 */

'use strict';

// =============================================================================
// NAVBAR MOBILE
// =============================================================================

/**
 * Controla o menu mobile (toggle)
 */
const initMobileMenu = () => {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (!navbarToggle || !navbarMenu) return;
    
    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
        navbarToggle.classList.toggle('active');
        
        // Previne scroll quando menu está aberto
        document.body.style.overflow = navbarMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fecha menu ao clicar em um link
    const navbarLinks = navbarMenu.querySelectorAll('.navbar-link');
    navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
};

// =============================================================================
// SMOOTH SCROLL
// =============================================================================

/**
 * Configura scroll suave para todos os links âncora internos
 */
const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
    });
};

/**
 * Manipula clique em links âncora
 * @param {Event} e - Evento de clique
 */
const handleAnchorClick = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const target = document.querySelector(href);
    
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// =============================================================================
// SCROLL ANIMATIONS
// =============================================================================

/**
 * Configurações do observer de scroll
 */
const observerConfig = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

/**
 * Callback do Intersection Observer
 * @param {IntersectionObserverEntry[]} entries - Elementos observados
 */
const handleIntersection = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateElement(entry.target);
            // Para de observar após animar (performance)
            scrollObserver.unobserve(entry.target);
        }
    });
};

/**
 * Anima um elemento quando entra no viewport
 * @param {HTMLElement} element - Elemento a ser animado
 */
const animateElement = (element) => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
};

/**
 * Prepara elementos para animação de scroll
 * @param {HTMLElement} element - Elemento a ser preparado
 */
const prepareElementForAnimation = (element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
};

// Inicializa o Intersection Observer
const scrollObserver = new IntersectionObserver(handleIntersection, observerConfig);

/**
 * Configura animações de scroll para elementos específicos
 */
const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll(
        '.step-card, .service-card, .feature-item'
    );
    
    animatedElements.forEach(element => {
        prepareElementForAnimation(element);
        scrollObserver.observe(element);
    });
};

// =============================================================================
// BUTTON HANDLERS
// =============================================================================

/**
 * Manipula cliques em botões
 * @param {Event} e - Evento de clique
 */
const handleButtonClick = (e) => {
    const buttonText = e.currentTarget.textContent.trim();
    console.log('Botão clicado:', buttonText);
    
    // Adicione lógica específica para cada botão aqui
    // Exemplo: navegação, modal, formulário, etc.
};

/**
 * Configura event listeners para todos os botões
 */
const initButtonHandlers = () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
};

// =============================================================================
// PAGE LOAD
// =============================================================================

/**
 * Anima a entrada da página no carregamento
 */
const animatePageLoad = () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease-in';
        document.body.style.opacity = '1';
    }, 100);
};

/**
 * Inicializa todas as funcionalidades quando o DOM estiver pronto
 */
const init = () => {
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initButtonHandlers();
};

// =============================================================================
// EVENT LISTENERS
// =============================================================================

// Aguarda carregamento completo da página
window.addEventListener('load', animatePageLoad);

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM já está pronto
    init();
}
