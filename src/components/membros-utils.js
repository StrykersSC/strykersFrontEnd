// IMPORTANTE: Este arquivo apenas re-exporta as funções de MembrosUtils.jsx
// NÃO registra novamente no window para evitar duplicação

import {
  mostrarMedalhasMembro as mostrarMedalhasMembroReact,
  fecharMedalhasSidebar as fecharMedalhasSidebarReact,
  mostrarDetalhesMedalha as mostrarDetalhesMedalhaReact,
  fecharModalMedalha as fecharModalMedalhaReact,
  mostrarMissoesMembro as mostrarMissoesMembroReact,
  fecharMissoesSidebar as fecharMissoesSidebarReact,
  mostrarHistoricoMembro as mostrarHistoricoMembroReact,
  fecharHistoricoMembro as fecharHistoricoMembroReact,
  mostrarDetalhesMissaoDoEvento as mostrarDetalhesMissaoDoEventoReact,
  fecharDetalhesMissao as fecharDetalhesMissaoReact,
  mostrarDetalhesMedalhaPublic as mostrarDetalhesMedalhaPublicReact,
  fecharModalMedalhaPublic as fecharModalMedalhaPublicReact,
} from './ui/MembrosUtils.jsx';

// Re-export for ES modules that import this file
export const mostrarMedalhasMembro = mostrarMedalhasMembroReact;
export const fecharMedalhasSidebar = fecharMedalhasSidebarReact;
export const mostrarDetalhesMedalha = mostrarDetalhesMedalhaReact;
export const fecharModalMedalha = fecharModalMedalhaReact;
export const mostrarMissoesMembro = mostrarMissoesMembroReact;
export const fecharMissoesSidebar = fecharMissoesSidebarReact;
export const mostrarHistoricoMembro = mostrarHistoricoMembroReact;
export const fecharHistoricoMembro = fecharHistoricoMembroReact;
export const mostrarDetalhesMissaoDoEvento = mostrarDetalhesMissaoDoEventoReact;
export const fecharDetalhesMissao = fecharDetalhesMissaoReact;
export const mostrarDetalhesMedalhaPublic = mostrarDetalhesMedalhaPublicReact;
export const fecharModalMedalhaPublic = fecharModalMedalhaPublicReact;

// NÃO expor funções globalmente aqui - isso já é feito em MembrosUtils.jsx
// Remover esta seção para evitar duplicação:
// if (typeof window !== 'undefined') { ... }
