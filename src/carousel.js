// Carrossel de imagens dinâmico
class Carousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.carousel = document.getElementById('carousel');
    this.indicatorsContainer = document.getElementById('carousel-indicators');
    this.indicators = [];
    this.autoPlayInterval = null;
    this.imagesPerSlide = 3;

    this.init();
  }

  async init() {
    // Carrega as imagens da pasta
    await this.loadImages();

    // Se não houver imagens, não inicia o carrossel
    if (this.totalSlides === 0) {
      console.warn('Nenhuma imagem encontrada na pasta /images');
      return;
    }

    // Adiciona event listeners aos indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Inicia o auto-play
    this.startAutoPlay();
  }

  async loadImages() {
    // Lista de possíveis imagens (você pode expandir essa lista)
    // Como não podemos listar diretamente o diretório no browser,
    // vamos tentar carregar imagens com nomes comuns
    const possibleImages = [];

    // Tenta carregar imagens numeradas de 1 a 50
    for (let i = 1; i <= 50; i++) {
      possibleImages.push(`/images/image${i}.jpg`);
      possibleImages.push(`/images/image${i}.jpeg`);
      possibleImages.push(`/images/image${i}.png`);
      possibleImages.push(`/images/img${i}.jpg`);
      possibleImages.push(`/images/img${i}.jpeg`);
      possibleImages.push(`/images/img${i}.png`);
      possibleImages.push(`/images/${i}.jpg`);
      possibleImages.push(`/images/${i}.jpeg`);
      possibleImages.push(`/images/${i}.png`);
    }

    // Verifica quais imagens existem
    const validImages = await this.checkImages(possibleImages);

    if (validImages.length === 0) {
      return;
    }

    // Embaralha as imagens aleatoriamente
    this.shuffleArray(validImages);

    // Cria os slides
    this.createSlides(validImages);
  }

  async checkImages(imagePaths) {
    const validImages = [];

    for (const path of imagePaths) {
      try {
        const exists = await this.imageExists(path);
        if (exists) {
          validImages.push(path);
        }
      } catch (error) {
        // Imagem não existe, continua
      }
    }

    return validImages;
  }

  imageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  createSlides(images) {
    // Divide as imagens em grupos de 3
    const slides = [];
    for (let i = 0; i < images.length; i += this.imagesPerSlide) {
      slides.push(images.slice(i, i + this.imagesPerSlide));
    }

    this.totalSlides = slides.length;

    // Cria o HTML dos slides
    slides.forEach((slideImages, slideIndex) => {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'flex-shrink-0 w-full grid grid-cols-3 gap-4 p-4';

      slideImages.forEach((imagePath, imgIndex) => {
        const imageContainer = document.createElement('div');
        imageContainer.className =
          'bg-slate-700 rounded-lg overflow-hidden h-64';

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Operação ${slideIndex * this.imagesPerSlide + imgIndex + 1}`;
        img.className = 'w-full h-full object-cover';

        imageContainer.appendChild(img);
        slideDiv.appendChild(imageContainer);
      });

      // Preenche com placeholders se necessário
      const remaining = this.imagesPerSlide - slideImages.length;
      for (let i = 0; i < remaining; i++) {
        const placeholder = document.createElement('div');
        placeholder.className =
          'bg-slate-700/30 rounded-lg h-64 flex items-center justify-center';
        placeholder.innerHTML =
          '<span class="text-slate-600 text-4xl">+</span>';
        slideDiv.appendChild(placeholder);
      }

      this.carousel.appendChild(slideDiv);
    });

    // Cria os indicadores
    this.createIndicators();
  }

  createIndicators() {
    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.className = `carousel-indicator w-3 h-3 rounded-full transition-opacity ${
        i === 0 ? 'bg-cyan-400' : 'bg-slate-500'
      }`;
      indicator.dataset.slide = i;
      this.indicatorsContainer.appendChild(indicator);
      this.indicators.push(indicator);
    }
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.carousel.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    this.updateIndicators();
    this.resetAutoPlay();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(this.currentSlide);
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentSlide) {
        indicator.classList.remove('bg-slate-500');
        indicator.classList.add('bg-cyan-400');
      } else {
        indicator.classList.remove('bg-cyan-400');
        indicator.classList.add('bg-slate-500');
      }
    });
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 10000); // Altere aqui o tempo de troca dos slides, em milisegundos
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }
}

// Inicializa o carrossel quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new Carousel();
});
