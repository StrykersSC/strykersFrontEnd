import { homePage } from './pages/home.js';
import { membrosPage } from './pages/membros.js';

export const router = {
  currentPage: null,

  pages: {
    home: homePage,
    membros: membrosPage,
    eventos: () =>
      '<div class="relative z-10 container mx-auto px-6 py-16"><h1 class="text-4xl text-white">EVENTOS - Em construção</h1></div>',
    recrutamento: () =>
      '<div class="relative z-10 container mx-auto px-6 py-16"><h1 class="text-4xl text-white">RECRUTAMENTO - Em construção</h1></div>',
    forcasespeciais: () =>
      '<div class="relative z-10 container mx-auto px-6 py-16"><h1 class="text-4xl text-white">FORÇAS ESPECIAIS - Em construção</h1></div>',
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

    // Atualiza links ativos no menu
    this.updateActiveLink(pageName);

    // Renderiza a página
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

    // Inicializa funcionalidades específicas da página
    if (pageName === 'home') {
      const { initCarousel } = await import('./carousel.js');
      initCarousel();
    } else if (pageName === 'membros') {
      const { initMembros } = await import('./membros.js');
      initMembros();
    }
  },
};
