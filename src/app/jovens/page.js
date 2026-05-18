"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const PADRAO_JOVENS = {
  "Kids-Escolar": ["work", "team", "task", "file", "desk"],
  "Kids-Final": ["office", "worker", "report", "email", "career"],
  "Teens-Escolar": ["company", "meeting", "manager", "project", "invoice"],
  "Teens-Final": ["interview", "business", "deadline", "customer", "contract"]
};

function JogoJovensContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef(null);
  const lockTeclado = useRef(false);

  const modalidade = searchParams.get('modalidade') || "Kids";
  const etapa = searchParams.get('etapa') || "Escolar";
  const nomeCompetidor = searchParams.get('nome') || "Anônimo";
  
  const equipesParam = searchParams.get('equipes');
  const nomesEquipes = equipesParam ? equipesParam.split(',') : [];
  const modoEquipes = nomesEquipes.length > 0;

  const [tempo, setTempo] = useState(60);
  const [palavras, setPalavras] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [digitado, setDigitado] = useState("");
  const [mostrarPalavra, setMostrarPalavra] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null); 
  const [fimDeJogo, setFimDeJogo] = useState(false);

  const [scores, setScores] = useState(nomesEquipes.map(() => 0));
  const [turnoEquipe, setTurnoEquipe] = useState(0);

  useEffect(() => {
    const chave = `${modalidade}-${etapa}`;
    const dadosLS = JSON.parse(localStorage.getItem("custom_words_jovens") || "{}");
    const listaDefinitiva = dadosLS[chave] || PADRAO_JOVENS[chave] || [];
    setPalavras(listaDefinitiva.map(p => ({ texto: p, status: "pendente" })));
  }, [modalidade, etapa]);

  const acertosTotal = palavras.filter(p => p.status === "acerto").length;

  const salvarRecorde = () => {
    if (!modoEquipes) {
      const novoScore = {
        nome: nomeCompetidor,
        acertos: acertosTotal,
        data: new Date().toLocaleDateString('pt-BR')
      };
      const placar = JSON.parse(localStorage.getItem('spelling_leaderboard') || '[]');
      placar.push(novoScore);
      placar.sort((a, b) => b.acertos - a.acertos);
      localStorage.setItem('spelling_leaderboard', JSON.stringify(placar));
    }
  };

  const validarPalavra = () => {
    if (!digitado || statusFeedback || fimDeJogo) return;
    
    const certa = palavras[indiceAtual].texto.toLowerCase();
    const digitada = digitado.trim().toLowerCase();
    const novas = [...palavras];

    if (digitada === certa) {
      novas[indiceAtual].status = "acerto";
      setStatusFeedback('acerto');
      if (modoEquipes) {
        const novosScores = [...scores];
        novosScores[turnoEquipe] += 1;
        setScores(novosScores);
      }
    } else {
      novas[indiceAtual].status = "erro";
      setStatusFeedback('erro');
    }
    setPalavras(novas);
    lockTeclado.current = true;
    setTimeout(() => { lockTeclado.current = false; }, 500);
  };

  const avancar = () => {
    if (lockTeclado.current) return;
    setStatusFeedback(null);
    setDigitado("");
    setMostrarPalavra(false);

    if (modoEquipes) {
      setTurnoEquipe((turnoEquipe + 1) % nomesEquipes.length);
    }

    if (indiceAtual < palavras.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      setFimDeJogo(true);
      salvarRecorde();
    }
  };

  const pularPalavra = () => {
    setDigitado("");
    setMostrarPalavra(false);
    if (modoEquipes) {
      setTurnoEquipe((turnoEquipe + 1) % nomesEquipes.length);
    }
    if (indiceAtual < palavras.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      setFimDeJogo(true);
      salvarRecorde();
    }
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
    } else if (tempo === 0 && !fimDeJogo) {
      setFimDeJogo(true);
      salvarRecorde();
    }
  }, [tempo, statusFeedback, fimDeJogo]);

  if (palavras.length === 0) return null;

  return (
    <div className={`min-h-screen relative flex flex-col md:flex-row font-sans transition-all duration-500 overflow-hidden ${
      statusFeedback === 'erro' ? 'bg-[#ef4444]' : statusFeedback === 'acerto' ? 'bg-[#22c55e]' : 'bg-[#00458c]'
    }`}>
      
      {/* LATERAL: PLACAR DE EQUIPES SELECIONÁVEIS POR CLIQUE */}
      {modoEquipes && (
        <div className="w-full md:w-85 bg-black/30 backdrop-blur-md p-6 flex flex-col border-b md:border-b-0 md:border-r border-white/10 z-20">
          <h3 className="text-white font-black text-xl uppercase mb-8 flex items-center gap-2 tracking-wider">
            Placar Geral
          </h3>
          <div className="space-y-4">
            {nomesEquipes.map((nome, i) => (
              <div 
                key={i} 
                onClick={() => setTurnoEquipe(i)}
                className={`p-4 rounded-2xl transition-all duration-500 border-2 flex items-center justify-between cursor-pointer select-none ${
                  turnoEquipe === i ? 'bg-white scale-105 border-yellow-400 shadow-2xl' : 'bg-white/10 border-transparent opacity-50 hover:bg-white/20'
                }`}
              >
                <div className="flex flex-col truncate mr-2">
                  <span className={`text-[9px] font-black uppercase ${turnoEquipe === i ? 'text-blue-800 animate-pulse' : 'text-white'}`}>
                    {turnoEquipe === i ? '• Respondendo' : 'Clique p/ selecionar'}
                  </span>
                  <span className={`text-lg font-black uppercase truncate max-w-[130px] ${turnoEquipe === i ? 'text-gray-900' : 'text-white'}`}>
                    {nome}
                  </span>
                </div>

                {/* Área de pontos + Controles manuais com trava de propagação */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); ajustarScoreManual(i, 1); }} 
                      className={`w-6 h-5 rounded text-xs font-black flex items-center justify-center transition ${turnoEquipe === i ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-white/20 text-white hover:bg-white/40'}`}
                    >
                      +
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); ajustarScoreManual(i, -1); }} 
                      className={`w-6 h-5 rounded text-xs font-black flex items-center justify-center transition ${turnoEquipe === i ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-white/20 text-white hover:bg-white/40'}`}
                    >
                      -
                    </button>
                  </div>
                  <span className={`text-4xl font-black w-10 text-center ${turnoEquipe === i ? 'text-blue-700' : 'text-white'}`}>
                    {scores[i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-auto pt-10 text-white/30 text-center text-xs font-bold uppercase tracking-widest">
            Senac Taquara
          </div>
        </div>
      )}

      {/* ÁREA CENTRAL DO JOGO */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 relative">
        <Link href="/" className="absolute top-6 right-6 border border-white text-white px-4 py-2 rounded-lg font-black text-xs uppercase hover:bg-white hover:text-blue-900 transition z-50 shadow-md">
          Sair
        </Link>

        {/* CRONÔMETRO */}
        <div className="bg-white/10 border border-white/20 px-8 py-2 rounded-full font-black text-3xl text-white mb-10 shadow-2xl backdrop-blur-sm">
          ⏱ {Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}
        </div>

        <div className="w-full max-w-[800px] z-10">
          {fimDeJogo ? (
            <div className="bg-white rounded-[40px] shadow-2xl p-12 flex flex-col items-center text-center">
              <span className="text-8xl mb-6">🏁</span>
              <h2 className="text-4xl font-black text-gray-800 mb-2 uppercase">Tempo Esgotado!</h2>
              
              {modoEquipes ? (
                <div className="w-full mt-8 space-y-4">
                  <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-4">Resultado da Trilha</p>
                  {nomesEquipes.map((nome, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                      <span className="font-black uppercase text-gray-700">{nome}</span>
                      <span className="text-3xl font-black text-blue-600">{scores[i]} pts</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 font-bold text-lg mt-4">Partida individual finalizada com sucesso.</p>
              )}

              <button onClick={() => router.push('/')} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-700 transition uppercase tracking-widest mt-8">
                Voltar ao Menu principal
              </button>
            </div>
          ) : !statusFeedback ? (
            <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-14 flex flex-col items-center relative transition-all border-b-[10px] border-gray-200">
               {modoEquipes && (
                  <div className="bg-yellow-400 text-black px-8 py-1.5 rounded-full font-black text-sm uppercase mb-4 shadow-md tracking-wider">
                    Vez de: {nomesEquipes[turnoEquipe]}
                  </div>
                )}
              
              <p className="text-gray-400 font-black text-xs mb-6 uppercase tracking-widest italic">
                Ouça a palavra com atenção
              </p>

              <h2 className={`text-6xl md:text-8xl font-black mb-10 uppercase tracking-tighter transition-all duration-500 ${mostrarPalavra ? 'text-gray-900 scale-100' : 'blur-3xl select-none text-gray-100 scale-95'}`}>
                {palavras[indiceAtual]?.texto}
              </h2>

              <div className="w-full flex flex-col gap-4">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={digitado}
                  onChange={(e) => setDigitado(e.target.value.toLowerCase())}
                  onKeyDown={(e) => e.key === 'Enter' && validarPalavra()}
                  placeholder="DIGITE AQUI A SOLETRAÇÃO DO GRUPO..." 
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-2xl md:text-4xl text-center font-black uppercase outline-none focus:border-blue-500 focus:bg-white text-gray-950 placeholder:text-gray-500 shadow-inner"
                  autoFocus
                />
                
                <div className="flex gap-2">
                  <button onClick={() => setMostrarPalavra(!mostrarPalavra)} className="flex-1 bg-gray-100 border border-gray-300 py-4 rounded-xl font-black text-gray-700 hover:bg-gray-200 transition uppercase text-xs">👁️ Ver</button>
                  <button onClick={() => {
                    const utter = new SpeechSynthesisUtterance(palavras[indiceAtual].texto);
                    utter.lang = 'en-US';
                    utter.rate = 0.8;
                    window.speechSynthesis.speak(utter);
                  }} className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition uppercase text-xs shadow-md tracking-wider">🔊 Ouvir Áudio</button>
                  <button onClick={pularPalavra} className="flex-1 bg-amber-100 border border-amber-300 py-4 rounded-xl font-black text-amber-700 hover:bg-amber-200 transition uppercase text-xs">➡️ Pular</button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-[50px] shadow-2xl p-16 flex flex-col items-center justify-center animate-in zoom-in duration-300 border-8 border-white/20 w-full ${statusFeedback === 'acerto' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}>
              <h2 className="text-6xl md:text-8xl font-black text-white mb-10 text-center uppercase tracking-tighter">
                {statusFeedback === 'acerto' ? 'Ponto! 🎉' : 'Errou! ✕'}
              </h2>
              <button 
                onClick={avancar}
                className="bg-white text-black font-black text-2xl md:text-3xl px-16 py-6 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
              >
                Próxima equipe ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JogoJovens() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#00458c] flex items-center justify-center text-white font-black text-2xl animate-pulse">Carregando Arena...</div>}>
      <JogoJovensContent />
    </Suspense>
  );
}