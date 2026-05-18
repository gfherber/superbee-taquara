"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const BANCO_DE_PALAVRAS = {
  "Kids-Escolar": ["apple", "blue", "dog", "sun", "jump"],
  "Kids-Final": ["butterfly", "garden", "school", "friend", "yellow"],
  "Teens-Escolar": ["action", "actor", "adventure", "airplane", "amazing"],
  "Teens-Final": ["challenge", "experience", "knowledge", "structure", "university"]
};

function JogoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef(null);
  const lockTeclado = useRef(false);
  const hasSaved = useRef(false);

  const modalidade = searchParams.get('modalidade') || "Kids";
  const etapa = searchParams.get('etapa') || "Escolar";
  const nomeCompetidor = searchParams.get('nome') || "Anônimo";

  const [tempo, setTempo] = useState(60);
  const [palavras, setPalavras] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [digitado, setDigitado] = useState("");
  const [mostrarPalavra, setMostrarPalavra] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null); 
  const [listaAberta, setListaAberta] = useState(false);
  const [fimDeJogo, setFimDeJogo] = useState(false);

  useEffect(() => {
    const chave = `${modalidade}-${etapa}`;
    const dadosLS = JSON.parse(localStorage.getItem("custom_words_superbee") || "{}");
    const listaDefinitiva = dadosLS[chave] || BANCO_DE_PALAVRAS[chave] || [];
    
    setPalavras(listaDefinitiva.map(p => ({ texto: p, status: "pendente" })));
  }, [modalidade, etapa]);

  const acertos = palavras.filter(p => p.status === "acerto").length;
  const erros = palavras.filter(p => p.status === "erro").length;

  const salvarRecordeNoPlacar = () => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    const novoScore = {
      nome: nomeCompetidor,
      acertos: acertos,
      erros: erros,
      tipo: `Super Bee (${modalidade})`,
      data: new Date().toLocaleDateString('pt-BR')
    };
    const placarAtual = JSON.parse(localStorage.getItem('spelling_leaderboard') || '[]');
    placarAtual.push(novoScore);
    placarAtual.sort((a, b) => b.acertos - a.acertos || a.erros - b.erros);
    localStorage.setItem('spelling_leaderboard', JSON.stringify(placarAtual));
  };

  const tocarSomFeedback = (tipo) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      if (tipo === 'acerto') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); 
        oscillator.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.08); 
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.3);
      } else {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(180, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (tempo > 0 && !statusFeedback && !fimDeJogo && palavras.length > 0) {
      const timer = setTimeout(() => setTempo(tempo - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tempo === 0 && !fimDeJogo && !statusFeedback) {
      setFimDeJogo(true);
      salvarRecordeNoPlacar();
    }
  }, [tempo, statusFeedback, palavras, fimDeJogo]);

  const falarPalavra = (texto) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(texto);
    utterThis.lang = 'en-US'; utterThis.rate = 0.8; synth.speak(utterThis);
  };

  useEffect(() => {
    if (palavras.length > 0 && indiceAtual < palavras.length && !statusFeedback && !fimDeJogo) {
      falarPalavra(palavras[indiceAtual].texto);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [indiceAtual, statusFeedback, palavras, fimDeJogo]);

  const validarPalavra = () => {
    if (!digitado || !palavras[indiceAtual] || statusFeedback || fimDeJogo) return;
    const palavraCerta = palavras[indiceAtual].texto.toLowerCase();
    const palavraDigitada = digitado.trim().toLowerCase();
    const novasPalavras = [...palavras];
    if (palavraDigitada === palavraCerta) {
      novasPalavras[indiceAtual].status = "acerto"; setStatusFeedback('acerto'); tocarSomFeedback('acerto');
    } else {
      novasPalavras[indiceAtual].status = "erro"; setStatusFeedback('erro'); tocarSomFeedback('erro');
    }
    setPalavras(novasPalavras);
    lockTeclado.current = true;
    setTimeout(() => { lockTeclado.current = false; }, 500);
  };

  const confirmarFeedbackEAvancar = () => {
    if (lockTeclado.current) return;
    setStatusFeedback(null); setDigitado(""); setMostrarPalavra(false);
    if (indiceAtual < palavras.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      setFimDeJogo(true);
      salvarRecordeNoPlacar();
    }
  };

  useEffect(() => {
    const lidarComTecladoGeral = (e) => {
      if (statusFeedback && (e.key === 'Enter' || e.key === ' ')) {
        confirmarFeedbackEAvancar();
      } else if (fimDeJogo && e.key === 'Enter') {
        router.push('/');
      }
    };
    window.addEventListener('keydown', lidarComTecladoGeral);
    return () => window.removeEventListener('keydown', lidarComTecladoGeral);
  }, [statusFeedback, indiceAtual, fimDeJogo]);

  if (palavras.length === 0) return null;

  return (
    <div className={`min-h-screen relative flex flex-col items-center py-10 font-sans transition-colors duration-500 overflow-hidden ${statusFeedback === 'erro' ? 'bg-[#ef4444]' : statusFeedback === 'acerto' ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`}>
      
      <div className="absolute inset-0 z-0 text-white/10 font-bold select-none pointer-events-none uppercase">
        <span className="absolute top-10 left-10 text-7xl rotate-[-10deg]">Smart</span>
        <span className="absolute top-40 right-10 text-8xl rotate-[15deg]">Success</span>
        <span className="absolute top-[40%] left-[-5%] text-9xl rotate-[-20deg]">Inspire</span>
        <span className="absolute top-[60%] right-[-5%] text-9xl rotate-[10deg]">Knowledge</span>
        <span className="absolute bottom-20 left-20 text-8xl rotate-[-5deg]">Focus</span>
        <span className="absolute bottom-10 right-20 text-7xl rotate-[15deg]">Language</span>
      </div>

      <Link href="/" className="absolute top-6 right-6 border border-white text-white px-4 py-2 rounded-lg font-bold hover:bg-white hover:text-[#f59e0b] transition z-50">Voltar ao início</Link>
      
      <div className="bg-white px-8 py-2 rounded-full font-bold text-2xl text-yellow-600 mb-8 shadow-md z-10 flex items-center gap-2">
        ⏱ {Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}
      </div>

      <div className="flex-grow flex items-center justify-center z-10 w-full px-4">
        {fimDeJogo ? (
          <div className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-[550px] flex flex-col items-center relative text-center">
            <span className="text-6xl mb-4">🏆</span>
            <h2 className="text-3xl font-black text-gray-800 mb-1 uppercase tracking-tight">Fim de Partida!</h2>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-8">{nomeCompetidor}</p>
            
            <div className="flex gap-12 justify-center mb-10 w-full">
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Acertos</span>
                <span className="text-5xl font-black text-green-500">✓ {acertos}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Erros</span>
                <span className="text-5xl font-black text-red-500">✕ {erros}</span>
              </div>
            </div>

            <button onClick={() => router.push('/')} className="w-full bg-[#f59e0b] hover:bg-yellow-500 text-black font-black py-4 rounded-2xl shadow-xl shadow-yellow-600/10 transition duration-200 uppercase tracking-wider text-sm cursor-pointer">Voltar ao Menu (Enter)</button>
          </div>
        ) : !statusFeedback ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-[40px] shadow-2xl p-12 w-full max-w-[700px] flex flex-col items-center relative">
            <p className="text-yellow-600 font-bold tracking-widest text-sm mb-12 uppercase">{nomeCompetidor} | Palavra {indiceAtual + 1} de {palavras.length}</p>
            <h2 className={`text-7xl font-extrabold mb-12 transition-all duration-300 uppercase ${mostrarPalavra ? 'text-gray-800' : 'blur-2xl select-none text-gray-300'}`}>{palavras[indiceAtual]?.texto}</h2>
            <input ref={inputRef} type="text" value={digitado} onChange={(e) => setDigitado(e.target.value.toLowerCase())} onKeyDown={(e) => e.key === 'Enter' && validarPalavra()} placeholder="DIGITE O QUE FOI SOLETRADO" className="w-full border-b-4 border-gray-200 focus:border-yellow-500 text-center pb-4 text-3xl outline-none bg-transparent font-bold uppercase placeholder:text-base text-gray-800" autoFocus />
          </div>
        ) : (
          <div className={`${statusFeedback === 'acerto' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'} border-8 border-white/20 rounded-[50px] shadow-2xl p-16 w-full max-w-[700px] min-h-[350px] flex flex-col items-center justify-center transition-all scale-105`}>
            <h2 className="text-6xl font-black text-white mb-10 flex items-center gap-6">{statusFeedback === 'acerto' ? <><span>🎉</span> Mandou bem!</> : <><span>✕</span> Quase lá!</>}</h2>
            <button onClick={confirmarFeedbackEAvancar} className="bg-white text-black font-black text-2xl px-14 py-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all">PRÓXIMO</button>
            <p className="text-white/80 font-bold mt-6">(Espaço / Enter)</p>
          </div>
        )}
      </div>

      {!fimDeJogo && (
        <div className="flex gap-6 mb-10 z-10">
          <button onClick={() => setMostrarPalavra(!mostrarPalavra)} className="bg-white w-16 h-16 rounded-full shadow-lg text-gray-700 flex items-center justify-center text-2xl hover:bg-gray-100 transition">👁️</button>
          <button onClick={() => falarPalavra(palavras[indiceAtual].texto)} className="bg-white w-16 h-16 rounded-full shadow-lg text-blue-600 flex items-center justify-center text-2xl hover:bg-gray-100 transition">🔊</button>
          <button onClick={() => { tocarSomFeedback('erro'); setStatusFeedback('erro'); const n = [...palavras]; n[indiceAtual].status="erro"; setPalavras(n); }} className="bg-white w-16 h-16 rounded-full shadow-lg text-red-600 flex items-center justify-center text-2xl hover:bg-gray-100 transition">✕</button>
        </div>
      )}

      <div className="bg-white w-full max-w-[900px] rounded-full px-8 py-4 shadow-2xl z-10 flex items-center justify-between mb-10">
        <div className="flex items-center gap-4"><span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Lista de Palavras</span><span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md font-bold text-xs">{palavras.length}</span></div>
        <div className="flex gap-4"><div className="bg-green-100 text-green-600 px-4 py-1 rounded-full font-black text-sm flex items-center gap-2">✓ {acertos}</div><div className="bg-red-100 text-red-600 px-4 py-1 rounded-full font-black text-sm flex items-center gap-2">✕ {erros}</div><button onClick={() => setListaAberta(!listaAberta)} className="text-yellow-500 font-bold text-xl ml-2">▼</button></div>
      </div>
      
      {listaAberta && (
        <div className="absolute bottom-32 bg-white w-[800px] max-h-60 overflow-y-auto rounded-2xl shadow-2xl z-50 p-4">
          {palavras.map((p, i) => (
            <div key={i} className={`p-3 border-b flex justify-between items-center ${p.status === 'acerto' ? 'bg-green-50/70' : p.status === 'erro' ? 'bg-red-50/70' : ''}`}>
              <span className="font-extrabold uppercase text-gray-900">{p.texto}</span>
              <span className={`font-black text-lg ${p.status === 'acerto' ? 'text-green-700' : p.status === 'erro' ? 'text-red-700' : 'text-gray-900'}`}>{p.status === 'acerto' ? '✓' : p.status === 'erro' ? '✕' : '-'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Jogo() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f59e0b] flex items-center justify-center text-white font-black text-2xl">Carregando...</div>}>
      <JogoContent />
    </Suspense>
  );
}