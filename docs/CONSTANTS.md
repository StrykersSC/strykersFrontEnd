# Gerenciamento de Constantes (Medalhas, Patentes e Forças Especiais)

Este documento explica como adicionar, modificar ou remover medalhas, patentes e forças especiais no projeto de forma centralizada.

## 📍 Localização dos Arquivos

Todos os arquivos de constantes estão em `src/constants/`:

```
src/constants/
├── medalhas.js          # Definições de medalhas/condecorações
├── patentes.js          # Lista de patentes/ranks
├── forcasEspeciais.js   # Forças especiais (S.T.O.R.M., G.H.O.S.T., etc.)
└── index.js             # Re-exports centralizados
```

---

## 🎖️ Adicionar uma Nova Medalha

**Arquivo:** `src/constants/medalhas.js`

### Estrutura de uma medalha:

```javascript
'chave-unica': {
  imagem: '/imgMedalhas/caminho-imagem.png',
  emoji: '🏅',  // Emoji representativo
  nome: 'Nome da Medalha',
  descricao: 'Descrição clara sobre quando e por quê conceder.',
}
```

### Exemplo: Adicionar "Medalha de Coragem":

```javascript
// src/constants/medalhas.js

const medalhas = {
  // ... medalhas existentes ...

  'coragem-exemplar': {
    imagem: '/imgMedalhas/medalha_coragem_exemplar.png',
    emoji: '⚔️',
    nome: 'Medalha de Coragem Exemplar',
    descricao:
      'Concedida a membros que demonstraram bravura e determinação em situações críticas.',
  },
};

export default medalhas;
```

**Passos:**

1. Defina uma chave única (ex: `'coragem-exemplar'`)
2. Adicione os campos: `imagem`, `emoji`, `nome`, `descricao`
3. A imagem deve estar em `/public/imgMedalhas/` ou ser uma URL válida
4. Salve o arquivo — a medalha aparecerá automaticamente nos dropdowns de condecoração

---

## 📜 Adicionar uma Nova Patente

**Arquivo:** `src/constants/patentes.js`

### Estrutura de patentes:

É um **array simples de strings**, ordenado do menor para o maior rank.

```javascript
const patentes = [
  'Recruta',
  'Soldado',
  'Cabo',
  // ... adicione novas patentes na posição correta ...
  'Marechal',
];
```

### Exemplo: Adicionar "Tenente-General":

```javascript
// src/constants/patentes.js

const patentes = [
  'Recruta',
  'Soldado',
  'Cabo',
  'Terceiro-Sargento',
  'Segundo-Sargento',
  'Primeiro-Sargento',
  'Sargento-Mor',
  'Subtenente',
  'Tenente',
  'Capitão',
  'Major',
  'Tenente-Coronel',
  'Coronel',
  'Brigadeiro',
  'General',
  'Tenente-General', // ← Nova patente
  'Marechal',
];

export default patentes;
```

**Passos:**

1. Insira a nova patente na posição correta (respeite a hierarquia)
2. Use a grafia exata (maiúsculas/minúsculas como no projeto)
3. Salve — a patente aparecerá em todos os formulários que usam patentes

---

## ⚡ Adicionar uma Nova Força Especial

**Arquivo:** `src/constants/forcasEspeciais.js`

### Estrutura de uma força especial:

```javascript
{
  id: 'identificador-unico',         // Identificador único (sem espaços)
  key: 'chave-curta',                // Chave curta para uso interno
  nome: 'Nome Exibido',              // Nome que aparece nos selects
  abreviatura: 'ABREV.',             // Abreviatura (ex: S.T.O.R.M.)
  descricao: 'Descrição detalhada...', // Descrição da força
  logo: '/logoForca.png',            // Caminho do logo em /public
}
```

### Exemplo: Adicionar força "Vanguarda Estratégica":

```javascript
// src/constants/forcasEspeciais.js

const forcasEspeciais = [
  // ... forças existentes ...

  {
    id: 'fs-vanguard',
    key: 'vanguard',
    nome: 'Vanguarda Estratégica',
    abreviatura: 'V.E.',
    descricao:
      'V.E. — Vanguarda Estratégica — unidade de ponta responsável por operações de estabelecimento de perímetro seguro e coordenação táctica.',
    logo: '/logoVanguard.png',
  },
];

export default forcasEspeciais;
```

**Passos:**

1. Use um `id` único (ex: `'fs-vanguard'`)
2. Defina todos os campos (nome, descrição, logo, etc.)
3. Coloque a imagem do logo em `/public/`
4. Salve — a força aparecerá automaticamente nos dropdowns de "Força Especial"

---

## 🔄 Como as Constantes são Usadas

### Importação em Componentes

Qualquer componente pode importar as constantes assim:

```javascript
// Importar individual
import medalhas from '../constants/medalhas';
import patentes from '../constants/patentes';
import { forcasEspeciais } from '../constants';

// Ou importar todos
import { medalhas, patentes, forcasEspeciais } from '../constants';
```

### Exemplos de Uso

**Formulário de Seleção de Patente:**

```jsx
<select>
  {patentes.map((p) => (
    <option key={p} value={p}>
      {p}
    </option>
  ))}
</select>
```

**Dropdown de Forças Especiais:**

```jsx
<select>
  <option value='Não'>Não</option>
  {forcasEspeciais.map((f) => (
    <option key={f.id} value={f.nome}>
      {f.nome}
    </option>
  ))}
</select>
```

**Lista de Medalhas Disponíveis:**

```jsx
<select>
  {Object.entries(medalhas).map(([key, valor]) => (
    <option key={key} value={key}>
      {valor.emoji} {valor.nome}
    </option>
  ))}
</select>
```

---

## 🔧 Onde os Campos Aparecem

| Campo                | Onde Aparece                                         |
| -------------------- | ---------------------------------------------------- |
| **Medalhas**         | Admin → Condecorar Membro / Perfil → Minhas Medalhas |
| **Patentes**         | Admin → Editar Membro / Cadastro de Membro           |
| **Forças Especiais** | Admin → Editar Membro / Perfil → Configurações       |

---

## ⚠️ Dicas Importantes

1. **Mantém Compatibilidade**: Se remover uma medalha/patente/força, membros existentes que a usam continuam exibindo o valor (não quebra);
2. **Nomes Únicos**: Use `id` e `key` únicos para evitar conflitos;
3. **Imagens**: Certifique-se de que arquivos PNG estão em `/public/` com os nomes corretos;
4. **Formatação**: Mantenha a indentação e sintaxe JavaScript consistentes;
5. **Testes**: Após editar, verifique se os dropdowns exibem as novas opções.

---

## 📋 Checklist para Adicionar Constantes

- [ ] Decida: Medalha, Patente ou Força Especial?
- [ ] Abra o arquivo correspondente em `src/constants/`
- [ ] Adicione a entrada seguindo a estrutura exata
- [ ] Se aplicável, adicione arquivos de imagem em `/public/` (medalhas/logos)
- [ ] Salve o arquivo
- [ ] Teste no navegador (Dev: `npm run dev`)
- [ ] Verifique se aparece nos dropdowns relevantes

---

**Última atualização:** 30/11/2025  
**Versão:** 1.0
