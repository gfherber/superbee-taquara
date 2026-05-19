"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { BANCO_PROFISSOES } from "../../data/bancoDePalavras";

const TODOS_CURSOS_SENAC = [
  "Técnico em Desenvolvimento de Sistemas", "Técnico em Administração",
  "Técnico em Contabilidade", "Técnico em Logística", "Técnico em Recursos Humanos",
  "Técnico em Transações Imobiliárias", "Técnico em Qualidade", "Técnico em Segurança do Trabalho",
  "Especialização Técnica em Segurança do Trabalho em Meio Ambiente", "Técnico em Design de Interiores",
  "Técnico em Guia de Turismo", "Técnico em Meio Ambiente", "Técnico em Óptica"
];

const emba = (arr) => [...arr].sort(() => Math.random() - 0.5);

function JogoProfissoesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eixo = searchParams.get('eixo') || "Geral";
  const nomeCompetidor = searchParams.get('nome') || "Anônimo";
  
  const equipesParam = searchParams.get('equipes');
  const nomesEquipes = equipesParam ? equipesParam.split(',') : [];
  const modoEquipes = nomesEquipes.length > 0;

  const [tempo, setTempo] = useState(15); 
  const [desafios, setDesafios] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [mostrarPalavra, setMostrarPalavra] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null); 
  const [fimDeJogo, setFimDeJogo] = useState(false);

  const [scores, setScores] = useState(nomesEquipes.map(() => 0));
  const [turnoEquipe, setTurnoEquipe] = useState(0);
  const [rodadaAtual, setRodadaAtual] = useState(1);
  const TOTAL_RODADAS = 3;

  useEffect(() => {
    const dadosLS = JSON.parse(localStorage.getItem("custom_words_profissoes") || "{}");
    let listaFiltro = [];

    if (eixo === "Geral") {
      const tec = (dadosLS["Tecnologia"]?.length > 0) ? dadosLS["Tecnologia"] : BANCO_PROFISSOES["Tecnologia"];
      const ges = (dadosLS["Gestão e Negócios"]?.length > 0) ? dadosLS["Gestão e Negócios"] : BANCO_PROFISSOES["Gestão e Negócios"];
      const sau = (dadosLS["Saúde, Turismo e Design"]?.length > 0) ? dadosLS["Saúde, Turismo e Design"] : BANCO_PROFISSOES["Saúde, Turismo e Design"];
      const ger = (dadosLS["Geral"]?.length > 0) ? dadosLS["Geral"] : BANCO_PROFISSOES["Geral"];
      
      listaFiltro = [...tec, ...ges, ...sau, ...ger];
    } else {
      listaFiltro = (dadosLS[eixo] && dadosLS[eixo].length > 0) ? dadosLS[eixo] : BANCO_PROFISSOES[eixo] || [];
    }
    
    const carregados = listaFiltro.map(item => {
      const errados = TODOS_CURSOS_SENAC.filter(c => c !== item.resposta);
      const erradosSorteados = emba(errados).slice(0, 2);
      return { ...item, opcoes: emba([item.resposta, ...erradosSorteados]), status: "pendente" };
    });
    
    setDesafios(emba(carregados));
  }, [eixo]);

  const validarResposta = (opcao) => {
    if (statusFeedback || fimDeJogo) return;
    const certa = desafios[indiceAtual].resposta.toLowerCase().trim();
    const escolhida = opcao.toLowerCase().trim();
    const novas = [...desafios];

    if (escolhida === certa) {
      novas[indiceAtual].status = "acerto";
      setStatusFeedback('acerto');
      if (modoEquipes) {
        const nS = [...scores]; nS[turnoEquipe] += 1; setScores(nS);
      }
    } else {
      novas[indiceAtual].status = "erro";
      setStatusFeedback('erro');
    }
    setDesafios(novas);
  };

  const avancar = () => {
    setStatusFeedback(null);
    setMostrarPalavra(false);
    setTempo(15);
    if (modoEquipes) {
      const p = turnoEquipe + 1;
      if (p < nomesEquipes.length) setTurnoEquipe(p);
      else {
        if (rodadaAtual < TOTAL_RODADAS) { setRodadaAtual(rodadaAtual + 1); setTurnoEquipe(0); }
        else { setFimDeJogo(true); return; }
      }
    } else if (indiceAtual >= 9) { setFimDeJogo(true); return; }
    
    if (indiceAtual < desafios.length - 1) setIndiceAtual(indiceAtual + 1);
    else setFimDeJogo(true);
  };

  const pularDesafio = () => {
    setMostrarPalavra(false);
    setTempo(15);
    if (modoEquipes) {
      const p = turnoEquipe + 1;
      if (p < nomesEquipes.length) setTurnoEquipe(p);
      else {
        if (rodadaAtual < TOTAL_RODADAS) { setRodadaAtual(rodadaAtual + 1); setTurnoEquipe(0); }
        else { setFimDeJogo(true); return; }
      }
    } else if (indiceAtual >= 9) { setFimDeJogo(true); return; }
    
    if (indiceAtual < desafios.length - 1) setIndiceAtual(indiceAtual + 1);
    else setFimDeJogo(true);
  };

  const ajustarScoreManual = (index, valor) => {
    const novosScores = [...scores];
    novosScores[index] = Math.max(0, novosScores[index] + valor);
    setScores(novosScores);
  };

  useEffect(() => {
    if (tempo > 0 && !statusFeedback && !fimDeJogo) {
      const timer = setTimeout(() => setTempo(tempo - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tempo === 0 && !fimDeJogo && !statusFeedback) {
      const novas = [...desafios];
      novas[indiceAtual].status = "erro";
      setStatusFeedback('erro');
      setDesafios(novas);
    }
  }, [tempo, statusFeedback, fimDeJogo, desafios, indiceAtual]);

  const obterDadosPodio = () => {
    const mapeado = nomesEquipes.map((nome, i) => ({ nome, score: scores[i] }));
    mapeado.sort((a, b) => b.score - a.score);
    let rankAtual = 1;
    const ranqueado = mapeado.map((item, idx) => {
      if (idx > 0 && item.score < mapeado[idx - 1].score) rankAtual = idx + 1;
      return { ...item, rank: rankAtual };
    });
    return {
      primeiros: ranqueado.filter(e => e.rank === 1 && e.score > 0),
      segundos: ranqueado.filter(e => e.rank === 2 && e.score > 0),
      terceiros: ranqueado.filter(e => e.rank === 3 && e.score > 0),
      restante: ranqueado.filter(e => e.rank > 3 || e.score === 0)
    };
  };

  const podio = obterDadosPodio();

  if (desafios.length === 0) return null;

  return (
    <div className={`min-h-screen relative flex flex-col md:flex-row font-sans transition-all duration-500 overflow-hidden ${
      statusFeedback === 'erro' ? 'bg-[#ef4444]' : statusFeedback === 'acerto' ? 'bg-[#22c55e]' : 'bg-purple-900'
    }`}>
      {modoEquipes && (
        <div className="w-full md:w-85 bg-black/30 backdrop-blur-md p-6 flex flex-col border-b md:border-b-0 md:border-r border-white/10 z-20">
          <h3 className="text-white font-black text-xl uppercase mb-8 flex items-center gap-2 tracking-wider">Placar Geral</h3>
          <div className="space-y-4">
            {nomesEquipes.map((nome, i) => (
              <div key={i} onClick={() => setTurnoEquipe(i)} className={`p-4 rounded-2xl transition-all duration-500 border-2 flex items-center justify-between cursor-pointer select-none ${turnoEquipe === i ? 'bg-white scale-105 border-cyan-400 shadow-2xl' : 'bg-white/10 border-transparent opacity-50 hover:bg-white/20'}`}>
                <div className="flex flex-col truncate mr-2">
                  <span className={`text-[9px] font-black uppercase ${turnoEquipe === i ? 'text-purple-800 animate-pulse' : 'text-white'}`}>{turnoEquipe === i ? '• Respondendo' : 'Clique p/ selecionar'}</span>
                  <span className={`text-lg font-black uppercase truncate max-w-[130px] ${turnoEquipe === i ? 'text-gray-900' : 'text-white'}`}>{nome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={(e) => { e.stopPropagation(); ajustarScoreManual(i, 1); }} className={`w-6 h-5 rounded text-xs font-black flex items-center justify-center transition ${turnoEquipe === i ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-white/20 text-white'}`}>+</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); ajustarScoreManual(i, -1); }} className={`w-6 h-5 rounded text-xs font-black flex items-center justify-center transition ${turnoEquipe === i ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-white/20 text-white'}`}>-</button>
                  </div>
                  <span className={`text-4xl font-black w-10 text-center ${turnoEquipe === i ? 'text-purple-700' : 'text-white'}`}>{scores[i]}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-10 text-white/30 text-center text-xs font-bold uppercase tracking-widest">Senac EAD</div>
        </div>
      )}

      <div className="flex-grow flex flex-col items-center justify-center p-6 relative">
        <Link href="/" className="absolute top-6 right-6 border border-white text-white px-4 py-2 rounded-lg font-black text-xs uppercase hover:bg-white hover:text-purple-900 transition z-50 shadow-md">Sair</Link>
        <div className={`bg-white/10 border border-white/20 px-8 py-2 rounded-full font-black text-3xl text-white mb-6 shadow-2xl backdrop-blur-sm transition-colors ${tempo <= 5 && !statusFeedback ? 'text-red-400 border-red-500 animate-pulse' : ''}`}>⏱ {Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}</div>
        <div className="w-full max-w-[850px] z-10">
          {fimDeJogo ? (
            <div className="bg-white rounded-[40px] shadow-2xl p-10 flex flex-col items-center w-full max-w-[800px] mx-auto animate-in zoom-in duration-300">
              <h2 className="text-4xl font-black text-gray-800 mb-1 uppercase tracking-tight">Trilha Concluída!</h2>
              {modoEquipes ? (
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-end justify-center w-full max-w-[600px] h-[280px] mb-10 px-4">
                    <div className="flex-1 flex flex-col items-center"><div className="text-center mb-2 px-2">{podio.segundos.map((e, idx) => <p key={idx} className="font-black text-sm uppercase text-gray-700">{e.nome}</p>)}</div><div className="w-full bg-slate-300 rounded-t-2xl h-[130px] flex flex-col items-center justify-center shadow-md"><span>🥈</span></div></div>
                    <div className="flex-1 flex flex-col items-center scale-105 z-10"><div className="text-center mb-2 px-2">{podio.primeiros.map((e, idx) => <p key={idx} className="font-black text-base uppercase text-yellow-600 animate-pulse">{e.nome}</p>)}</div><div className="w-full bg-yellow-400 rounded-t-2xl h-[190px] flex flex-col items-center justify-center shadow-xl"><span>🥇</span></div></div>
                    <div className="flex-1 flex flex-col items-center"><div className="text-center mb-2 px-2">{podio.terceiros.map((e, idx) => <p key={idx} className="font-black text-sm uppercase text-gray-700">{e.nome}</p>)}</div><div className="w-full bg-amber-600 rounded-t-2xl h-[90px] flex flex-col items-center justify-center shadow-md"><span>🥉</span></div></div>
                  </div>
                </div>
              ) : (
                <div className="my-6 text-center"><span className="text-5xl font-black text-purple-600">✓ {scores[0]}</span></div>
              )}
              <button type="button" onClick={() => router.push('/')} className="w-full bg-purple-700 text-white font-black py-5 rounded-2xl shadow-xl transition mt-8 text-sm uppercase">Voltar ao Menu principal</button>
            </div>
          ) : !statusFeedback ? (
            <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 flex flex-col items-center relative border-b-[10px] border-gray-200">
               {modoEquipes && <div className="bg-cyan-400 text-black px-8 py-1.5 rounded-full font-black text-sm uppercase mb-4 shadow-md tracking-wider">Rodada {rodadaAtual} de {TOTAL_RODADAS} | Vez de: {nomesEquipes[turnoEquipe]}</div>}
              <div className="min-h-[140px] flex items-center justify-center text-center px-4 mb-6"><h2 className="text-xl md:text-2xl font-black text-gray-800 leading-snug">"{desafios[indiceAtual]?.pergunta}"</h2></div>
              <div className="w-full flex flex-col gap-3 mb-6">
                {desafios[indiceAtual]?.opcoes?.map((opcao, idx) => (
                  <button key={idx} type="button" onClick={() => validarResposta(opcao)} className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 text-sm md:text-base font-black uppercase text-gray-800 hover:bg-purple-50 hover:border-purple-500 transition-all">{opcao}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`rounded-[50px] shadow-2xl p-16 flex flex-col items-center justify-center border-8 border-white/20 w-full ${statusFeedback === 'acerto' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}>
              <h2 className="text-6xl font-black text-white mb-6 text-center uppercase">{statusFeedback === 'acerto' ? 'Ponto! 🎉' : 'Erro! ✕'}</h2>
              <button type="button" onClick={avancar} className="bg-white text-black font-black text-2xl px-16 py-5 rounded-full shadow-2xl hover:scale-105 transition-all uppercase">Continuar ➔</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JogoProfissoes() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-900 flex items-center justify-center text-white font-black text-2xl">Carregando...</div>}>
      <JogoProfissoesContent />
    </Suspense>
  );
}