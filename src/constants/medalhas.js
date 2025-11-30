// Definições originais de medalhas usadas no projeto.
// Mantido como objeto com chaves para compatibilidade com o código existente
// (ex: Object.entries(MEDALHAS_DISPONIVEIS) nos formulários).
const medalhas = {
  'merito-operacional': {
    imagem: '/imgMedalhas/medalha_merito_operacional.png',
    emoji: '🎖️',
    nome: 'Medalha de Mérito Operacional',
    descricao:
      'Concedida a membros que demonstraram excelência em incursões táticas e operações hostis com sucesso.',
  },
  'defesa-avancada': {
    imagem: '/imgMedalhas/medalha_defesa_avancada.png',
    emoji: '🛡️',
    nome: 'Medalha de Defesa Avançada',
    descricao:
      'Reconhecimento por atuações destacadas na proteção de VIPs, comboios e zonas estratégicas sob ameaça.',
  },
  'elite-aerea': {
    imagem: '/imgMedalhas/medalha_elite_aerea.png',
    emoji: '🥇',
    nome: 'Medalha de Elite Aérea',
    descricao:
      'Premiação para pilotos que demonstraram superioridade aérea, manobras avançadas e domínio total em combate espacial.',
  },
  'infantaria-pesada': {
    imagem: '/imgMedalhas/medalha_infantaria_pesada.png',
    emoji: '🥈',
    nome: 'Medalha de Infantaria Pesada',
    descricao:
      'Concedida a soldados de chão que atuaram com coragem, disciplina e precisão em combates terrestres e manobras com veículos.',
  },
  'aguia-dourada': {
    imagem: '/imgMedalhas/medalha_insignia_aguia_dourada.png',
    emoji: '🦅',
    nome: 'Insígnia da Águia Dourada',
    descricao:
      'Honraria rara, concedida apenas aos que lideraram operações completas com sucesso total, mostrando comando, estratégia e disciplina.',
  },
  'honra-logistica': {
    imagem: '/imgMedalhas/medalha_distintivo_honra_logistica.png',
    emoji: '🪙',
    nome: 'Distintivo de Honra Logística',
    descricao:
      'Entregue a operadores de logística e transporte que garantiram o sucesso de missões com eficiência e organização impecável.',
  },
};

export default medalhas;
