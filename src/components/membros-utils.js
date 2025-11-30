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

// Expor funções globalmente
if (typeof window !== 'undefined') {
  window.mostrarMissoesMembro = mostrarMissoesMembroReact;
  window.fecharMissoesSidebar = fecharMissoesSidebarReact;
  window.mostrarDetalhesMissaoDoEvento = mostrarDetalhesMissaoDoEventoReact;
  window.fecharDetalhesMissao = fecharDetalhesMissaoReact;
  window.mostrarMedalhasMembro = mostrarMedalhasMembroReact;
  window.fecharMedalhasSidebar = fecharMedalhasSidebarReact;
  window.mostrarDetalhesMedalha = mostrarDetalhesMedalhaReact;
  window.fecharModalMedalha = fecharModalMedalhaReact;
  window.mostrarHistoricoMembro = mostrarHistoricoMembroReact;
  window.fecharHistoricoMembro = fecharHistoricoMembroReact;
  // public perfil usage
  window.mostrarDetalhesMedalhaNoPerfilPublic =
    mostrarDetalhesMedalhaPublicReact;
  window.fecharModalMedalhaPublic = fecharModalMedalhaPublicReact;
}
