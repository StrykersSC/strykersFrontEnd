import { router } from './router.js';
import { initCarousel } from './carousel.js';

// Inicializa o router quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  router.init();

  // Adiciona listeners nos links de navegação
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.dataset.page;
      router.navigate(page);
    });
  });

  // Inicializa na home
  router.navigate('home');
});
