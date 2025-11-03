// Carrossel de imagens dinâmico
class Carousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.carousel = document.getElementById('carousel');
    this.indicatorsContainer = document.getElementById('carousel-indicators');
    this.indicators = [];
    this.autoPlayInterval = null;
    this.imgCarrosselPerSlide = 3;

    if (this.carousel && this.indicatorsContainer) {
      this.init();
    }
  }

  async init() {
    await this.loadimgCarrossel();

    if (this.totalSlides === 0) {
      console.warn('Nenhuma imagem encontrada na pasta /imgCarrossel');
      return;
    }

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    this.startAutoPlay();
  }

  async loadimgCarrossel() {
    const possibleimgCarrossel = [];

    for (let i = 1; i <= 50; i++) {
      possibleimgCarrossel.push(`/imgCarrossel/image${i}.jpg`);
      possibleimgCarrossel.push(`/imgCarrossel/image${i}.jpeg`);
      possibleimgCarrossel.push(`/imgCarrossel/image${i}.png`);
      possibleimgCarrossel.push(`/imgCarrossel/img${i}.jpg`);
      possibleimgCarrossel.push(`/imgCarrossel/img${i}.jpeg`);
      possibleimgCarrossel.push(`/imgCarrossel/img${i}.png`);
      possibleimgCarrossel.push(`/imgCarrossel/${i}.jpg`);
      possibleimgCarrossel.push(`/imgCarrossel/${i}.jpeg`);
      possibleimgCarrossel.push(`/imgCarrossel/${i}.png`);
    }

    const validimgCarrossel = await this.checkimgCarrossel(
      possibleimgCarrossel
    );

    if (validimgCarrossel.length === 0) {
      return;
    }

    this.shuffleArray(validimgCarrossel);
    this.createSlides(validimgCarrossel);
  }

  async checkimgCarrossel(imagePaths) {
    const validimgCarrossel = [];

    for (const path of imagePaths) {
      try {
        const exists = await this.imageExists(path);
        if (exists) {
          validimgCarrossel.push(path);
        }
      } catch (error) {
        // Imagem não existe
      }
    }

    return validimgCarrossel;
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

  createSlides(imgCarrossel) {
    const slides = [];
    for (let i = 0; i < imgCarrossel.length; i += this.imgCarrosselPerSlide) {
      slides.push(imgCarrossel.slice(i, i + this.imgCarrosselPerSlide));
    }

    this.totalSlides = slides.length;

    slides.forEach((slideimgCarrossel, slideIndex) => {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'flex-shrink-0 w-full grid grid-cols-3 gap-4 p-4';

      slideimgCarrossel.forEach((imagePath, imgIndex) => {
        const imageContainer = document.createElement('div');
        imageContainer.className =
          'bg-slate-700 rounded-lg overflow-hidden h-64';

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Operação ${
          slideIndex * this.imgCarrosselPerSlide + imgIndex + 1
        }`;
        img.className = 'w-full h-full object-cover';

        imageContainer.appendChild(img);
        slideDiv.appendChild(imageContainer);
      });

      const remaining = this.imgCarrosselPerSlide - slideimgCarrossel.length;
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
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }
}

export function initCarousel() {
  new Carousel();
}
