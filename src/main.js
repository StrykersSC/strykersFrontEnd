import { router } from './router.js';
import { initAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  router.init();
  initAuth();
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (link) {
      e.preventDefault();
      const page = link.dataset.page;
      router.navigate(page);
    }
  });
  router.navigate('home');
});
window.router = router;
