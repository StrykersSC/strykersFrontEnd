# 🎠 Carrossel de Imagens

Documentação completa do sistema de carrossel de imagens da página inicial.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Configuração](#configuração)
- [Funcionamento](#funcionamento)
- [Personalização](#personalização)
- [Solução de Problemas](#solução-de-problemas)

## 🎯 Visão Geral

O carrossel de imagens é um componente dinâmico que exibe fotos das operações da Strykers na página inicial. Ele carrega automaticamente as imagens de uma pasta específica e as organiza em slides.

### Características

- ✅ Carregamento automático de imagens
- ✅ Suporte para até 50 imagens
- ✅ Exibe 3 imagens por vez
- ✅ Navegação automática (5 segundos)
- ✅ Indicadores de slide clicáveis
- ✅ Transições suaves
- ✅ Ordem aleatória das imagens

## ⚙️ Configuração

### 1. Preparando as Imagens

#### Renomeação

As imagens devem seguir um dos seguintes padrões de nomenclatura:

**Opção 1: Prefixo "image"**

```
image1.jpg
image2.jpg
image3.png
...
image50.jpeg
```

**Opção 2: Prefixo "img"**

```
img1.jpg
img2.png
img3.jpeg
...
img50.jpg
```

**Opção 3: Apenas números**

```
1.jpg
2.png
3.jpeg
...
50.jpg
```

#### Formatos Suportados

- ✅ `.jpg`
- ✅ `.jpeg`
- ✅ `.png`

#### Local das Imagens

Coloque todas as imagens renomeadas na pasta:

```
public/imgCarrossel/
```

### 2. Estrutura de Pastas

```
strykersFrontEnd/
└── public/
    └── imgCarrossel/
        ├── image1.jpg
        ├── image2.png
        ├── image3.jpeg
        └── ...
```

### 3. Exemplo Prático

Se você tem 10 fotos de operações:

1. Renomeie-as:

   ```
   image1.jpg  (foto da operação Alpha)
   image2.jpg  (foto da operação Bravo)
   image3.png  (foto do treinamento CQB)
   image4.jpg  (foto da mega operação)
   ...
   image10.jpg (foto da campanha final)
   ```

2. Copie para `public/imgCarrossel/`

3. Pronto! O carrossel detectará automaticamente

## 🔧 Funcionamento

### Detecção Automática

O sistema tenta carregar imagens seguindo este processo:

1. Procura por `image1.jpg`, `image1.jpeg`, `image1.png`
2. Depois `img1.jpg`, `img1.jpeg`, `img1.png`
3. Por fim `1.jpg`, `1.jpeg`, `1.png`
4. Repete o processo de 1 até 50

### Organização em Slides

- Cada slide exibe **3 imagens**
- Se você tem 10 imagens, terá 4 slides:
  - Slide 1: imagens 1, 2, 3
  - Slide 2: imagens 4, 5, 6
  - Slide 3: imagens 7, 8, 9
  - Slide 4: imagem 10 + 2 placeholders

### Navegação

- **Automática**: Muda de slide a cada 5 segundos
- **Manual**: Clique nos indicadores (bolinhas) na parte inferior
- **Resetável**: Ao navegar manualmente, o timer reinicia

### Ordem Aleatória

As imagens são embaralhadas automaticamente para variar a experiência em cada visita.

## 🎨 Personalização

### Alterar Quantidade de Imagens por Slide

No arquivo `src/carousel.js`, linha 8:

```javascript
this.imgCarrosselPerSlide = 3; // Altere para 2, 4, 5, etc.
```

### Alterar Tempo de Auto-Play

No arquivo `src/carousel.js`, linha 142:

```javascript
this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
// Altere 5000 para outro valor em milissegundos
// 3000 = 3 segundos
// 10000 = 10 segundos
```

### Alterar Limite Máximo de Imagens

No arquivo `src/carousel.js`, linha 30:

```javascript
for (let i = 1; i <= 50; i++) {
// Altere 50 para o novo limite desejado
```

### Desabilitar Ordem Aleatória

No arquivo `src/carousel.js`, comente a linha 66:

```javascript
// this.shuffleArray(validimgCarrossel);
```

### Alterar Altura das Imagens

No arquivo `src/pages/home.js`, procure por `h-64` e altere:

```javascript
// h-64 = 256px (altura atual)
// Opções: h-48, h-56, h-64, h-72, h-80, h-96
imageContainer.className = 'bg-slate-700 rounded-lg overflow-hidden h-72';
```

## 🐛 Solução de Problemas

### Problema: Nenhuma imagem aparece

**Possíveis causas:**

1. **Nomenclatura incorreta**

   - ✅ Solução: Verifique se as imagens seguem um dos padrões (image1, img1, ou 1)

2. **Pasta errada**

   - ✅ Solução: Confirme que as imagens estão em `public/imgCarrossel/`

3. **Formato não suportado**

   - ✅ Solução: Converta para JPG, JPEG ou PNG

4. **Nomes com espaços ou caracteres especiais**
   - ✅ Solução: Use apenas números (image1.jpg, não image 1.jpg)

### Problema: Algumas imagens não aparecem

**Possíveis causas:**

1. **Sequência quebrada**

   - Exemplo: tem image1, image2, image4 (falta o 3)
   - ✅ Solução: Renumere para manter sequência contínua

2. **Extensões misturadas**
   - Exemplo: image1.jpg, image2.png (o sistema procura primeiro jpg)
   - ✅ Solução: Padronize a extensão ou renomeie

### Problema: Imagens distorcidas

**Causa:** Proporções diferentes das imagens

**Solução:** Use a classe `object-cover` (já aplicada) ou redimensione as imagens para mesma proporção (recomendado: 16:9)

### Problema: Carregamento lento

**Possíveis causas:**

1. **Imagens muito grandes**

   - ✅ Solução: Otimize as imagens (recomendado: máximo 500KB cada)

2. **Muitas imagens**
   - ✅ Solução: Reduza a quantidade ou reduza o limite máximo

### Problema: Indicadores não funcionam

**Causa:** JavaScript desabilitado ou erro no console

**Solução:**

1. Verifique o console do navegador (F12)
2. Confirme que não há erros JavaScript
3. Recarregue a página

## 📊 Dicas de Otimização

### Tamanho Ideal das Imagens

- **Resolução**: 1920x1080 ou menor
- **Peso**: Máximo 500KB por imagem
- **Formato**: JPG para fotos (melhor compressão)
- **Proporção**: 16:9 para melhor visualização

### Ferramentas de Otimização

- **Online**: TinyPNG, Squoosh
- **Desktop**: GIMP, Photoshop
- **Linha de comando**: ImageMagick

### Exemplo de Otimização com ImageMagick

```bash
# Redimensionar e comprimir todas as imagens
for i in *.jpg; do
  convert "$i" -resize 1920x1080 -quality 85 "image${i}"
done
```

## 🔍 Logs de Depuração

Para ver informações sobre o carregamento no console:

1. Abra o console do navegador (F12)
2. Recarregue a página
3. Procure por mensagens do carrossel

Mensagens importantes:

- "Nenhuma imagem encontrada na pasta /imgCarrossel" - Nenhuma imagem detectada
- Erros 404 - Arquivo não encontrado no caminho especificado

## 📝 Checklist de Implementação

- [ ] Imagens renomeadas corretamente
- [ ] Imagens copiadas para `public/imgCarrossel/`
- [ ] Formato correto (JPG, JPEG ou PNG)
- [ ] Sequência numérica contínua (1, 2, 3...)
- [ ] Imagens otimizadas (tamanho/peso)
- [ ] Testado no navegador
- [ ] Sem erros no console

## 🎓 Exemplo Completo

### Cenário: Adicionar 5 fotos de operações

**Passo 1:** Renomear arquivos

```
operacao_alpha_2024.jpg     → image1.jpg
treinamento_cqb.png         → image2.png
mega_op_dezembro.jpg        → image3.jpg
campanha_final.jpeg         → image4.jpeg
foto_time_completo.jpg      → image5.jpg
```

**Passo 2:** Estrutura final

```
public/
└── imgCarrossel/
    ├── image1.jpg
    ├── image2.png
    ├── image3.jpg
    ├── image4.jpeg
    └── image5.jpg
```

**Passo 3:** Resultado

- 2 slides no carrossel
- Slide 1: 3 primeiras imagens
- Slide 2: 2 últimas imagens + 1 placeholder

---

**Disciplina. Ordem. Supremacia.**
