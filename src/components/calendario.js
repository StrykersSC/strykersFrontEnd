import React from 'react';
import { createRoot } from 'react-dom/client';
import Calendario from './ui/Calendario.jsx';

let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

export function renderCalendario({
  modo = 'visualizacao',
  containerId = null,
} = {}) {
  const container = containerId
    ? document.getElementById(containerId)
    : document.getElementById('calendario-dias');
  if (!container) return;

  // If admin container was requested, ensure the outer markup exists (the legacy admin code expects a parent wrapper)
  if (containerId) {
    const adminDiv = container;
    // If adminDiv has no children, we assume the page wants the standard calendar shell
    if (!adminDiv.closest('.calendar-mounted')) {
      // Create a shell with title and buttons if not present
      const shell = document.createElement('div');
      shell.className = 'calendar-mounted';
      shell.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-6">
            <button id="btn-mes-anterior-admin" class="text-white hover:text-cyan-400 text-2xl transition-colors">◀</button>
            <h3 id="calendario-titulo-admin" class="text-2xl font-bold text-white"></h3>
            <button id="btn-mes-proximo-admin" class="text-white hover:text-cyan-400 text-2xl transition-colors">▶</button>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <div class="text-center text-cyan-400 font-semibold py-2">DOM</div>
            <div class="text-center text-cyan-400 font-semibold py-2">SEG</div>
            <div class="text-center text-cyan-400 font-semibold py-2">TER</div>
            <div class="text-center text-cyan-400 font-semibold py-2">QUA</div>
            <div class="text-center text-cyan-400 font-semibold py-2">QUI</div>
            <div class="text-center text-cyan-400 font-semibold py-2">SEX</div>
            <div class="text-center text-cyan-400 font-semibold py-2">SÁB</div>
            <div id="calendario-dias-admin" class="col-span-7 grid grid-cols-7 gap-2"></div>
          </div>
        </div>
      `;
      // Clear container and append shell
      adminDiv.innerHTML = '';
      adminDiv.appendChild(shell);
    }
  }

  // Mount React Calendario into the correct inner container (admin vs normal)
  const mountPoint = containerId
    ? document.getElementById('calendario-dias-admin')
    : document.getElementById('calendario-dias');
  if (!mountPoint) return;

  // Create or reuse a root for this mount point
  if (!mountPoint._reactRoot) {
    const root = createRoot(mountPoint);
    mountPoint._reactRoot = root;
    root.render(
      React.createElement(Calendario, {
        mesInicial: mesAtual,
        anoInicial: anoAtual,
        modo,
        admin: !!containerId,
        onChangeMonth: (m, a) => {
          mesAtual = m;
          anoAtual = a;
        },
      })
    );
  } else {
    // Re-render with updated props
    mountPoint._reactRoot.render(
      React.createElement(Calendario, {
        mesInicial: mesAtual,
        anoInicial: anoAtual,
        modo,
        admin: !!containerId,
        onChangeMonth: (m, a) => {
          mesAtual = m;
          anoAtual = a;
        },
      })
    );
  }
}
