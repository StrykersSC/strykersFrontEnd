import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

export default function Recrutamento() {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(!currentUser);
  const [formData, setFormData] = useState({
    nome: currentUser?.nome || '',
    email: currentUser?.email || '',
    whatsapp: currentUser?.whatsapp || '',
    experiencia: '',
    forca_preferida: 'Infantaria',
    mensagem: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Salvar candidatura no localStorage
    const candidaturas = JSON.parse(
      localStorage.getItem('strykers_candidaturas') || '[]'
    );
    candidaturas.push({
      id: Date.now(),
      ...formData,
      dataCandidatura: new Date().toISOString(),
      status: 'pendente',
    });
    localStorage.setItem('strykers_candidaturas', JSON.stringify(candidaturas));

    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className='relative z-10 container mx-auto px-6 py-16'>
      <div className='mb-12 text-center'>
        <h2 className='text-5xl font-bold text-white mb-4 tracking-wide'>
          RECRUTAMENTO
        </h2>
        <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
          Junte-se aos STRYKERS — uma unidade de elite no universo de Star
          Citizen
        </p>
      </div>

      {/* Cards informativos */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors'>
          <div className='text-4xl mb-3'>🎖️</div>
          <h3 className='text-xl font-bold text-cyan-400 mb-2'>
            ESTRUTURA MILITAR
          </h3>
          <p className='text-gray-300 text-sm'>
            Hierarquia clara com patentes, missões e oportunidades de evolução
            profissional.
          </p>
        </div>

        <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors'>
          <div className='text-4xl mb-3'>👥</div>
          <h3 className='text-xl font-bold text-cyan-400 mb-2'>
            COMUNIDADE ATIVA
          </h3>
          <p className='text-gray-300 text-sm'>
            Grupo unido de jogadores dedicados a operações coordenadas e
            camaradagem.
          </p>
        </div>

        <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors'>
          <div className='text-4xl mb-3'>🚀</div>
          <h3 className='text-xl font-bold text-cyan-400 mb-2'>
            MÚLTIPLAS FRENTES
          </h3>
          <p className='text-gray-300 text-sm'>
            Infantaria, Força Aérea, Marinha Espacial, Logística e Forças
            Especiais.
          </p>
        </div>
      </div>

      {/* Seção de Requisitos */}
      <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-12'>
        <h3 className='text-2xl font-bold text-cyan-400 mb-4'>
          REQUISITOS PARA ALISTAR-SE
        </h3>
        <ul className='space-y-3 text-gray-300'>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 text-xl'>✓</span>
            <span>Ter conta ativa em Star Citizen</span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 text-xl'>✓</span>
            <span>Ser maior de 16 anos (recomendado 18+)</span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 text-xl'>✓</span>
            <span>Aceitar a Charter e Código de Conduta da organização</span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 text-xl'>✓</span>
            <span>Ter disposição para trabalhar em equipe</span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-cyan-400 text-xl'>✓</span>
            <span>Estar disponível para treinamentos iniciais</span>
          </li>
        </ul>
      </div>

      {/* Formulário de candidatura */}
      {showForm ? (
        <div className='bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-8 max-w-2xl mx-auto'>
          <h3 className='text-2xl font-bold text-cyan-400 mb-6'>
            FORMULÁRIO DE CANDIDATURA
          </h3>

          {submitted && (
            <div className='mb-6 p-4 bg-green-900/30 border border-green-700 rounded text-green-300'>
              ✅ Candidatura enviada com sucesso! Você receberá contato em
              breve.
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-gray-300 text-sm mb-2'>
                NOME COMPLETO *
              </label>
              <input
                type='text'
                name='nome'
                value={formData.nome}
                onChange={handleChange}
                required
                className='w-full bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='Seu nome completo'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-gray-300 text-sm mb-2'>
                  E-MAIL *
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                  placeholder='seu@email.com'
                />
              </div>
              <div>
                <label className='block text-gray-300 text-sm mb-2'>
                  WHATSAPP
                </label>
                <input
                  type='tel'
                  name='whatsapp'
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className='w-full bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                  placeholder='(11) 99999-9999'
                />
              </div>
            </div>

            <div>
              <label className='block text-gray-300 text-sm mb-2'>
                EXPERIÊNCIA EM STAR CITIZEN
              </label>
              <select
                name='experiencia'
                value={formData.experiencia}
                onChange={handleChange}
                className='w-full bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
              >
                <option value=''>Selecione...</option>
                <option value='iniciante'>Iniciante (menos de 3 meses)</option>
                <option value='intermediario'>
                  Intermediário (3-12 meses)
                </option>
                <option value='avancado'>Avançado (mais de 1 ano)</option>
              </select>
            </div>

            <div>
              <label className='block text-gray-300 text-sm mb-2'>
                FORÇA PREFERIDA
              </label>
              <select
                name='forca_preferida'
                value={formData.forca_preferida}
                onChange={handleChange}
                className='w-full bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
              >
                <option value='Infantaria'>Infantaria</option>
                <option value='Aviacao'>Força Aérea</option>
                <option value='Marinha Espacial'>Marinha Espacial</option>
                <option value='Logistica'>Logística</option>
                <option value='Forças Especiais'>Forças Especiais</option>
              </select>
            </div>

            <div>
              <label className='block text-gray-300 text-sm mb-2'>
                MENSAGEM PESSOAL
              </label>
              <textarea
                name='mensagem'
                value={formData.mensagem}
                onChange={handleChange}
                rows={5}
                className='w-full bg-slate-900 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors'
                placeholder='Conte-nos um pouco sobre você, por que quer se juntar aos Strykers, e quais são seus objetivos...'
              />
            </div>

            <div className='flex gap-4'>
              <button
                type='submit'
                className='flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-6 py-3 transition-colors'
              >
                ✓ ENVIAR CANDIDATURA
              </button>
              <button
                type='button'
                onClick={() => setShowForm(false)}
                className='flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded px-6 py-3 transition-colors'
              >
                CANCELAR
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className='text-center'>
          <p className='text-gray-300 mb-6 text-lg'>
            Obrigado por seu interesse em se juntar aos STRYKERS!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className='bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded px-8 py-3 transition-colors'
          >
            NOVA CANDIDATURA
          </button>
        </div>
      )}

      {/* Seção final */}
      <div className='mt-16 bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-8 text-center'>
        <h3 className='text-2xl font-bold text-cyan-400 mb-4'>
          PRÓXIMOS PASSOS
        </h3>
        <p className='text-gray-300 mb-6'>
          Após enviar sua candidatura, um administrador analisará seu perfil.
          Você receberá uma mensagem via WhatsApp ou e-mail com o resultado. Se
          aprovado, participará de um treinamento inicial e será integrado à
          unidade.
        </p>
        <p className='text-cyan-400 font-semibold'>
          "Disciplina. Ordem. Supremacia."
        </p>
      </div>
    </div>
  );
}
