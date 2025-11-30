import React, { useEffect, useState, useRef } from 'react';

function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default function Carousel({ perSlide = 3 }) {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const possible = [];
      for (let i = 1; i <= 50; i++) {
        possible.push(`/imgCarrossel/image${i}.jpg`);
        possible.push(`/imgCarrossel/image${i}.jpeg`);
        possible.push(`/imgCarrossel/image${i}.png`);
        possible.push(`/imgCarrossel/img${i}.jpg`);
        possible.push(`/imgCarrossel/img${i}.jpeg`);
        possible.push(`/imgCarrossel/img${i}.png`);
        possible.push(`/imgCarrossel/${i}.jpg`);
        possible.push(`/imgCarrossel/${i}.jpeg`);
        possible.push(`/imgCarrossel/${i}.png`);
      }

      const valid = [];
      for (const p of possible) {
        try {
          // sequential check — avoids flooding
          // eslint-disable-next-line no-await-in-loop
          const ok = await imageExists(p);
          if (ok) valid.push(p);
        } catch (e) {
          // ignore
        }
      }

      if (!mounted) return;

      if (valid.length === 0) {
        setSlides([]);
        setLoading(false);
        return;
      }

      shuffleArray(valid);

      const chunked = [];
      for (let i = 0; i < valid.length; i += perSlide) {
        chunked.push(valid.slice(i, i + perSlide));
      }

      setSlides(chunked);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [perSlide]);

  useEffect(() => {
    if (!slides || slides.length === 0) return undefined;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [slides]);

  const goTo = (i) => {
    setCurrent(i);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % slides.length);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className='p-8 text-center text-gray-400'>Carregando galeria...</div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <div className='p-8 text-center text-gray-400'>
        Nenhuma imagem encontrada na pasta <code>/imgCarrossel</code>
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='overflow-hidden'>
        <div
          className='flex transition-transform duration-500 ease-in-out'
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, sIdx) => (
            <div
              key={sIdx}
              className='flex-shrink-0 w-full grid grid-cols-3 gap-4 p-4'
            >
              {slide.map((imgPath, iIdx) => (
                <div
                  key={iIdx}
                  className='bg-slate-700 rounded-lg overflow-hidden h-64'
                >
                  <img
                    src={imgPath}
                    alt={`Operação ${sIdx * perSlide + iIdx + 1}`}
                    className='w-full h-full object-cover'
                  />
                </div>
              ))}
              {Array.from({ length: Math.max(0, perSlide - slide.length) }).map(
                (_, k) => (
                  <div
                    key={`ph-${k}`}
                    className='bg-slate-700/30 rounded-lg h-64 flex items-center justify-center'
                  >
                    <span className='text-slate-600 text-4xl'>+</span>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-opacity ${
              i === current ? 'bg-cyan-400' : 'bg-slate-500'
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
