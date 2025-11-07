import { homePage } from './pages/home.js';
import { membrosPage } from './pages/membros.js';
import { eventosPage } from './pages/eventos.js';
import { forcasEspeciaisPage } from './pages/forcasespeciais.js';
import { perfilPage } from './pages/perfil.js';
import { administracaoPage } from './pages/administracao.js';

export const router = {
  currentPage: null,

  pages: {
    home: homePage,
    membros: membrosPage,
    eventos: eventosPage,
    forcasespeciais: forcasEspeciaisPage,
    perfil: perfilPage,
    administracao: administracaoPage,
    recrutamento: () =>
      '<div class="relative z-10 container mx-auto px-6 py-16"><h1 class="text-4xl text-white">RECRUTAMENTO - Em construção</h1></div>',
  },

  init() {
    this.contentContainer = document.getElementById('app-content');
  },

  navigate(pageName) {
    if (this.currentPage === pageName) return;

    const pageFunction = this.pages[pageName];
    if (!pageFunction) {
      console.error(`Página ${pageName} não encontrada`);
      return;
    }

    this.updateActiveLink(pageName);
    this.render(pageFunction, pageName);
    this.currentPage = pageName;
  },

  updateActiveLink(pageName) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      if (link.dataset.page === pageName) {
        link.classList.add('text-cyan-400', 'border-b-2', 'border-cyan-400');
        link.classList.remove('text-gray-300');
      } else {
        link.classList.remove('text-cyan-400', 'border-b-2', 'border-cyan-400');
        link.classList.add('text-gray-300');
      }
    });
  },

  async render(pageFunction, pageName) {
    const content = await pageFunction();
    this.contentContainer.innerHTML = content;

    if (pageName === 'home') {
      const { initCarousel } = await import('./carousel.js');
      initCarousel();
    } else if (pageName === 'membros') {
      const { initMembros } = await import('./membros.js');
      initMembros();
    } else if (pageName === 'eventos') {
      const { initEventos } = await import('./eventos.js');
      initEventos();
    } else if (pageName === 'forcasespeciais') {
      const { initForcasEspeciais } = await import('./forcasespeciais.js');
      initForcasEspeciais();
    } else if (pageName === 'perfil') {
      const { initPerfil } = await import('./pages/perfil.js');
      initPerfil();
    } else if (pageName === 'administracao') {
      const { initAdministracao } = await import('./pages/administracao.js');
      initAdministracao();
    }
  },
};
