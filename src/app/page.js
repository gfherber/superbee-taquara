"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Bancos de palavras padrão (Sugeridos)
const SUGERIDAS_SUPERBEE = {
  "Kids-Escolar": ["apple", "blue", "dog", "sun", "jump"],
  "Kids-Final": ["butterfly", "garden", "school", "friend", "yellow"],
  "Teens-Escolar": ["action", "actor", "adventure", "airplane", "amazing"],
  "Teens-Final": ["challenge", "experience", "knowledge", "structure", "university"]
};

const SUGERIDAS_JOVENS = {
  "Kids-Escolar": ["work", "team", "task", "file", "desk"],
  "Kids-Final": ["office", "worker", "report", "email", "career"],
  "Teens-Escolar": ["company", "meeting", "manager", "project", "invoice"],
  "Teens-Final": ["interview", "business", "deadline", "customer", "contract"]
};

export default function Home() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [modalidade, setModalidade] = useState("Kids");
  const [etapa, setEtapa] = useState("Escolar");
  const [modo, setModo] = useState("superbee"); 
  const [verPlacar, setVerPlacar] = useState(false);
  const [verAdmin, setVerAdmin] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [erroNome, setErroNome] = useState(false);

  // Estados do Painel Admin
  const [adminModo, setAdminModo] = useState("superbee");
  const [adminModalidade, setAdminModalidade] = useState("Kids");
  const [adminEtapa, setAdminEtapa] = useState("Escolar");
  const [palavrasAdmin, setPalavrasAdmin] = useState([]);
  const [novaPalavra, setNovaPalavra] = useState("");

  // Atualiza as palavras exibidas no Admin quando os filtros mudam
  useEffect(() => {
    const chaveLS = adminModo === "superbee" ? "custom_words_superbee" : "custom_words_jovens";
    const bancoPadrao = adminModo === "superbee" ? SUGERIDAS_SUPERBEE : SUGERIDAS_JOVENS;
    const dadosLS = JSON.parse(localStorage.getItem(chaveLS) || "{}");
    const filtro = `${adminModalidade}-${adminEtapa}`;
    
    setPalavrasAdmin(dadosLS[filtro] || bancoPadrao[filtro] || []);
  }, [adminModo, adminModalidade, adminEtapa, verAdmin]);

  const iniciarJogo = (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErroNome(true);
      return;
    }
    setErroNome(false);

    if (modo === "superbee") {
      router.push(`/jogo?modalidade=${modalidade}&etapa=${etapa}&nome=${encodeURIComponent(nome.trim())}`);
    } else {
      router.push(`/jovens?modalidade=${modalidade}&etapa=${etapa}&nome=${encodeURIComponent(nome.trim())}`);
    }
  };

  const abrirPlacar = () => {
    const dados = JSON.parse(localStorage.getItem('spelling_leaderboard') || '[]');
    setRanking(dados);
    setVerPlacar(true);
    setVerAdmin(false);
  };

  // Funções do Painel Admin
  const salvarPalavrasNoLS = (novasPalavras) => {
    const chaveLS = adminModo === "superbee" ? "custom_words_superbee" : "custom_words_jovens";
    const dadosLS = JSON.parse(localStorage.getItem(chaveLS) || "{}");
    const filtro = `${adminModalidade}-${adminEtapa}`;
    
    dadosLS[filtro] = novasPalavras;
    localStorage.setItem(chaveLS, JSON.stringify(dadosLS));
    setPalavrasAdmin(novasPalavras);
  };

  const adicionarPalavraAdmin = () => {
    const formatada = novaPalavra.trim().toLowerCase().replace(/\s/g, '');
    if (!formatada) return;
    if (palavrasAdmin.includes(formatada)) {
      alert("Esta palavra já existe nesta categoria!");
      return;
    }
    const atualizadas = [...palavrasAdmin, formatada];
    salvarPalavrasNoLS(atualizadas);
    setNovaPalavra("");
  };

  const removerPalavraAdmin = (palavraRemover) => {
    const atualizadas = palavrasAdmin.filter(p => p !== palabraRemover);
    salvarPalavrasNoLS(atualizadas);
  };

  const restaurarSugeridasAdmin = () => {
    if (confirm("Tens a certeza que desejas restaurar as palavras sugeridas padrão para esta categoria?")) {
      const bancoPadrao = adminModo === "superbee" ? SUGERIDAS_SUPERBEE : SUGERIDAS_JOVENS;
      const filtro = `${adminModalidade}-${adminEtapa}`;
      salvarPalavrasNoLS(bancoPadrao[filtro] || []);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden font-sans bg-gray-50 relative">
      
      {/* BOTÃO DESLIZANTE NO TOPO */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur border border-gray-200/80 p-1.5 rounded-full shadow-2xl flex items-center gap-1 select-none w-[90%] max-w-[380px] md:max-w-[400px]">
        <button onClick={() => { setModo("superbee"); setVerPlacar(false); setVerAdmin(false); setErroNome(false); }} className={`flex-1 text-center py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${modo === "superbee" ? "bg-[#f59e0b] text-black shadow-md scale-105" : "text-gray-400 hover:text-gray-600"}`}>Super Bee</button>
        <button onClick={() => { setModo("jovens"); setVerPlacar(false); setVerAdmin(false); setErroNome(false); }} className={`flex-1 text-center py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${modo === "jovens" ? "bg-[#00458c] text-white shadow-md scale-105" : "text-gray-400 hover:text-gray-600"}`}>Jovens Aprendizes</button>
      </div>

      {/* Lado Esquerdo (Laranja ou Azul) */}
      <div className={`w-full md:w-1/2 text-white flex flex-col justify-center items-start px-12 md:px-20 py-20 md:py-0 relative overflow-hidden min-h-[45vh] md:min-h-screen transition-colors duration-500 ${modo === "superbee" ? "bg-[#f59e0b]" : "bg-[#00458c]"}`}>
        <div className="absolute inset-0 z-0 text-white font-black select-none pointer-events-none uppercase tracking-tighter">
          <span className="absolute top-10 left-10 text-7xl rotate-[-10deg] opacity-10">Smart</span>
          <span className="absolute top-40 right-10 text-8xl rotate-[15deg] opacity-5">Spelling</span>
          <span className="absolute top-[40%] left-[-5%] text-9xl rotate-[-20deg] opacity-10">{modo === "superbee" ? "Mindset" : "Senac"}</span>
          <span className="absolute top-[60%] right-[-5%] text-9xl rotate-[10deg] opacity-5">Bee</span>
          <span className="absolute bottom-20 left-20 text-8xl rotate-[-5deg] opacity-10">Focus</span>
          <span className="absolute bottom-10 right-20 text-7xl rotate-[15deg] opacity-5">Language</span>
        </div>
        <div className="w-full max-w-[384px] h-48 relative mb-8 flex items-center justify-center z-10"> 
          <Image src="/logo-superbee.png" alt="Logo Super Bee" fill sizes="(max-width: 768px) 100vw, 384px" className="object-contain" priority />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight z-10 tracking-tight">{modo === "superbee" ? <>Prepare-se<br />para Soletrar!</> : <>Inglês para<br />Jovens Aprendizes</>}</h1>
        <p className="text-base md:text-lg font-medium max-w-md text-white/90 z-10">{modo === "superbee" ? "Teste suas habilidades, expanda seu vocabulário e pratique para a competição Spelling Bee nesta edição 2026." : "Pratique a pronúncia, melhore a escrita técnica e domine o vocabulário do mercado corporativo e comercial do Senac."}</p>
      </div>

      {/* Lado Direito */}
      <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center items-center py-20 md:py-0 relative min-h-[55vh] md:min-h-screen">
        <div className={`bg-white p-8 md:p-10 rounded-[32px] shadow-2xl w-[90%] transition-all duration-300 ${verAdmin ? 'max-w-[500px]' : 'max-w-[400px]'}`}>
          
          {!verPlacar && !verAdmin ? (
            /* VISUAL DO FORMULÁRIO CONFIGURAÇÃO */
            <>
              <h2 className="text-3xl font-black text-center text-gray-800 mb-1 tracking-tight">{modo === "superbee" ? "Spelling Bee" : "Learning Track"}</h2>
              <p className="text-center text-gray-400 mb-6 font-semibold text-sm">Configure sua partida:</p>
              
              <div className="mb-4">
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Nome do Competidor</label>
                <input type="text" value={nome} onChange={(e) => { setNome(e.target.value); if (erroNome) setErroNome(false); }} placeholder="EX: GABRIEL FERNANDO" className={`w-full border rounded-xl p-3 text-gray-700 font-bold outline-none uppercase tracking-wide transition-all ${erroNome ? "border-red-500 bg-red-50/60" : "border-gray-200 bg-gray-50/80 focus:bg-white"}`} />
                {erroNome && <p className="text-red-500 text-xs font-black mt-2 uppercase tracking-wider flex items-center gap-1 animate-pulse">⚠ Por favor, digite seu nome para começar!</p>}
              </div>
              <div className="mb-4">
                <label className={`block text-xs font-black mb-2 uppercase tracking-wider ${modo === "superbee" ? "text-yellow-600" : "text-[#00458c]"}`}>Modalidade</label>
                <select value={modalidade} onChange={(e) => setModalidade(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 bg-gray-50/80 font-bold outline-none cursor-pointer"><option value="Kids">Kids</option><option value="Teens">Teens & Adults</option></select>
              </div>
              <div className="mb-6">
                <label className={`block text-xs font-black mb-2 uppercase tracking-wider ${modo === "superbee" ? "text-yellow-600" : "text-[#00458c]"}`}>Etapa</label>
                <select value={etapa} onChange={(e) => setEtapa(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 bg-gray-50/80 font-bold outline-none cursor-pointer"><option value="Escolar">Escolar</option><option value="Final">Semi-final & Final</option></select>
              </div>
              <button onClick={iniciarJogo} className={`w-full hover:scale-[1.02] active:scale-[0.98] font-black py-4 rounded-xl shadow-xl transition-all duration-300 tracking-wide cursor-pointer ${modo === "superbee" ? "bg-[#f59e0b] text-black shadow-yellow-600/10" : "bg-[#00458c] text-white shadow-blue-900/20"}`}>COMEÇAR O JOGO →</button>
              
              <div className="flex justify-between mt-4 px-2">
                <button onClick={abrirPlacar} className="text-xs font-bold text-gray-400 hover:text-gray-600 transition mt-4 uppercase tracking-widest flex items-center gap-1 cursor-pointer">🏆 Ver Placar</button>
                <button onClick={() => setVerAdmin(true)} className="text-xs font-bold text-gray-400 hover:text-gray-600 transition mt-4 uppercase tracking-widest flex items-center gap-1 cursor-pointer">⚙️ Painel Admin</button>
              </div>
            </>
          ) : verPlacar ? (
            /* VISUAL DO PLACAR DE LÍDERES LOCAL */
            <>
              <h2 className="text-2xl font-black text-center text-gray-800 mb-1 tracking-tight">🏆 Hall da Fama</h2>
              <p className="text-center text-gray-400 mb-6 font-semibold text-xs uppercase tracking-widest">Top 5 Melhores Pontuações</p>
              <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto mb-6 pr-1">
                {ranking.length === 0 ? (
                  <p className="text-center text-sm font-bold text-gray-400 py-8 italic">Nenhum recorde registrado ainda!</p>
                ) : (
                  ranking.slice(0, 5).map((jogador, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-gray-400 w-4">{i + 1}º</span>
                        <div className="flex flex-col"><span className="font-black text-sm text-gray-800 uppercase tracking-wide truncate max-w-[140px]">{jogador.nome}</span><span className="text-[10px] font-bold text-gray-400 uppercase">{jogador.tipo}</span></div>
                      </div>
                      <div className="flex items-center gap-2 font-black text-sm"><span className="text-green-600">✓ {jogador.acertos}</span><span className="text-gray-300">|</span><span className="text-xs text-gray-400 font-normal">{jogador.data}</span></div>
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => setVerPlacar(false)} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-black py-3 rounded-xl shadow-md transition cursor-pointer text-sm uppercase tracking-wider">← Voltar</button>
            </>
          ) : (
            /* VISUAL DO PAINEL ADMIN DE GERENCIAMENTO DE PALAVRAS (Letras Escuras e Nítidas) */
            <>
              <h2 className="text-2xl font-black text-center text-gray-800 mb-1 tracking-tight">Configurações de Vocabulário</h2>
              <p className="text-center text-gray-400 mb-6 font-semibold text-xs uppercase tracking-widest">Cria ou Edita as listas de palavras</p>
              
              {/* Filtros Internos do Admin - Corrigido para Letras Bem Escuras */}
              <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <select value={adminModo} onChange={(e) => setAdminModo(e.target.value)} className="text-xs font-black p-1.5 bg-white border border-gray-200 rounded-md outline-none text-gray-900 cursor-pointer"><option value="superbee">Super Bee</option><option value="jovens">Jovens</option></select>
                <select value={adminModalidade} onChange={(e) => setAdminModalidade(e.target.value)} className="text-xs font-black p-1.5 bg-white border border-gray-200 rounded-md outline-none text-gray-900 cursor-pointer"><option value="Kids">Kids</option><option value="Teens">Teens</option></select>
                <select value={adminEtapa} onChange={(e) => setAdminEtapa(e.target.value)} className="text-xs font-black p-1.5 bg-white border border-gray-200 rounded-md outline-none text-gray-900 cursor-pointer"><option value="Escolar">Escolar</option><option value="Final">Final</option></select>
              </div>

              {/* Input para Adicionar Palavra */}
              <div className="flex gap-2 mb-4">
                <input type="text" value={novaPalavra} onChange={(e) => setNovaPalavra(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && adicionarPalavraAdmin()} placeholder="Nova palavra..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-black outline-none uppercase text-gray-900 bg-gray-50/50 focus:bg-white transition" />
                <button onClick={adicionarPalavraAdmin} className="bg-green-600 hover:bg-green-700 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition">Incluir</button>
              </div>

              {/* Lista com Scroll das Palavras Atuais - Corrigido para Letras Bem Escuras */}
              <div className="border border-gray-100 bg-gray-50/50 rounded-xl p-3 max-h-[160px] overflow-y-auto mb-4 flex flex-wrap gap-2">
                {palavrasAdmin.length === 0 ? (
                  <p className="text-center text-xs font-bold text-gray-400 w-full py-4 italic">Lista vazia! Adiciona palavras acima.</p>
                ) : (
                  palavrasAdmin.map((palavra, index) => (
                    <div key={index} className="flex items-center gap-1.5 bg-white border border-gray-300 pl-3 pr-2 py-1 rounded-lg shadow-sm text-xs font-black text-gray-900 uppercase tracking-wide">
                      {palavra}
                      <button onClick={() => removerPalavraAdmin(palavra)} className="text-red-500 hover:text-red-700 font-black text-sm ml-1 cursor-pointer">✕</button>
                    </div>
                  ))
                )}
              </div>

              {/* Botões de Ação Inferiores */}
              <div className="flex gap-2">
                <button onClick={restaurarSugeridasAdmin} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition">Sugeridas</button>
                <button onClick={() => setVerAdmin(false)} className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition">Salvar & Fechar</button>
              </div>
            </>
          )}
        </div>
        <div className="absolute bottom-6 md:bottom-10 flex gap-4 opacity-90 z-10 h-12 w-64 justify-center items-center">
          <Image src="/logo-fecomercio-senac.png" alt="Logo Fecomércio RS / Senac" width={240} height={48} className="object-contain" />
        </div>
      </div>
    </div>
  );
}