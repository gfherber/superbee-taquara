"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [modalidade, setModalidade] = useState("Kids");
  const [etapa, setEtapa] = useState("Escolar");
  const [eixo, setEixo] = useState("Geral");
  const [modo, setModo] = useState("superbee"); 
  const [verPlacar, setVerPlacar] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [erroNome, setErroNome] = useState(false);

  const [modoEquipes, setModoEquipes] = useState(false);
  const [qtdEquipes, setQtdEquipes] = useState(2);
  const [nomesEquipes, setNomesEquipes] = useState(["Equipe A", "Equipe B", "Equipe C", "Equipe D"]);

  const handleNomeEquipe = (index, valor) => {
    const novos = [...nomesEquipes];
    novos[index] = valor;
    setNomesEquipes(novos);
  };

  const iniciarJogo = (e) => {
    e.preventDefault();
    if (!modoEquipes && !nome.trim()) {
      setErroNome(true);
      return;
    }
    
    const params = new URLSearchParams({
      nome: modoEquipes ? "Modo Equipes" : nome.trim(),
    });

    if (modoEquipes) {
      params.append("equipes", nomesEquipes.slice(0, qtdEquipes).join(","));
    }

    if (modo === "profissoes") {
      params.append("eixo", eixo);
      router.push(`/profissoes?${params.toString()}`);
    } else {
      params.append("modalidade", modalidade);
      params.append("etapa", etapa);
      if (modo === "superbee") {
        router.push(`/jogo?${params.toString()}`);
      } else {
        router.push(`/jovens?${params.toString()}`);
      }
    }
  };

  const abrirPlacar = () => {
    const dados = JSON.parse(localStorage.getItem('spelling_leaderboard') || '[]');
    setRanking(dados);
    setVerPlacar(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden font-sans bg-gray-50 relative text-gray-900">
      
      {/* SELETOR DE MODO NO TOPO */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur border border-gray-200 p-1.5 rounded-full shadow-2xl flex items-center gap-1 w-[95%] max-w-[550px]">
        <button type="button" onClick={() => { setModo("superbee"); setModoEquipes(false); }} className={`flex-1 text-center py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${modo === "superbee" ? "bg-[#f59e0b] text-black shadow-md" : "text-gray-400"}`}>Super Bee</button>
        <button type="button" onClick={() => { setModo("jovens"); }} className={`flex-1 text-center py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${modo === "jovens" ? "bg-[#00458c] text-white shadow-md" : "text-gray-400"}`}>Jovens Aprendizes</button>
        <button type="button" onClick={() => { setModo("profissoes"); }} className={`flex-1 text-center py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${modo === "profissoes" ? "bg-purple-700 text-white shadow-md" : "text-gray-400"}`}>Profissões EAD</button>
      </div>

      {/* LADO ESQUERDO */}
      <div className={`w-full md:w-1/2 text-white flex flex-col justify-center items-start px-12 md:px-20 py-20 relative overflow-hidden transition-colors duration-500 ${modo === "superbee" ? "bg-[#f59e0b]" : modo === "jovens" ? "bg-[#00458c]" : "bg-purple-900"}`}>
        <div className="absolute inset-0 z-0 font-black select-none pointer-events-none uppercase opacity-10 text-8xl">
          <span className="absolute top-10 left-10 rotate-[-10deg]">Smart</span>
          <span className="absolute bottom-10 right-10 rotate-[15deg]">Focus</span>
        </div>
        <div className="w-full max-w-[384px] h-48 relative mb-8 flex items-center justify-center z-10"> 
          <Image src="/logo-superbee.png" alt="Logo" fill sizes="384px" className="object-contain" priority />
        </div>
        <h1 className="text-5xl font-black mb-4 leading-tight z-10 tracking-tight">
          {modo === "superbee" ? "Prepare-se para Soletrar!" : modo === "jovens" ? "Inglês para Jovens Aprendizes" : "Guia de Profissões Senac EAD"}
        </h1>
      </div>

      {/* LADO DIREITO */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center py-20 relative">
        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-2xl w-[95%] max-w-[450px] transition-all duration-300">
          
          {!verPlacar ? (
            <>
              <h2 className="text-3xl font-black text-center mb-1">{modo === "superbee" ? "Spelling Bee" : modo === "jovens" ? "Learning Track" : "EAD Quiz"}</h2>
              <p className="text-center text-gray-400 mb-6 font-semibold text-sm italic">Configuração da dinâmica:</p>
              
              {/* TOGGLE MODO EQUIPES */}
              {modo !== "superbee" && (
                <div className={`mb-6 flex items-center justify-between p-4 rounded-2xl border ${modo === "jovens" ? "bg-blue-50 border-blue-100" : "bg-purple-50 border-purple-100"}`}>
                  <div className="flex flex-col">
                    <span className={`font-black text-sm uppercase ${modo === "jovens" ? "text-[#00458c]" : "text-purple-800"}`}>Modo Equipes</span>
                    <span className="text-[10px] font-bold text-gray-400">Ideal para Projetor</span>
                  </div>
                  <button type="button" onClick={() => setModoEquipes(!modoEquipes)} className={`w-14 h-7 rounded-full transition-all relative ${modoEquipes ? (modo === 'jovens' ? 'bg-blue-600' : 'bg-purple-600') : 'bg-gray-300'}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${modoEquipes ? 'left-8' : 'left-1'}`} /></button>
                </div>
              )}

              {modoEquipes ? (
                <div className="mb-6 space-y-4">
                   <div>
                    <label className="block text-[10px] font-black uppercase mb-2">Quantidade de Grupos</label>
                    <div className="flex gap-2">
                      {[2, 3, 4].map(n => (
                        <button type="button" key={n} onClick={() => setQtdEquipes(n)} className={`flex-1 py-2 rounded-lg font-black transition-all ${qtdEquipes === n ? (modo === 'jovens' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white') : 'bg-gray-100 text-gray-400'}`}>{n}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: qtdEquipes }).map((_, i) => (
                      <div key={i}>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Grupo {i+1}</label>
                        <input type="text" value={nomesEquipes[i]} onChange={(e) => handleNomeEquipe(i, e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm font-bold bg-gray-50 outline-none uppercase text-gray-900" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Nome do Competidor</label>
                  <input type="text" value={nome} onChange={(e) => { setNome(e.target.value); setErroNome(false); }} placeholder="EX: GABRIEL FERNANDO" className={`w-full border rounded-xl p-3 text-gray-700 font-bold outline-none uppercase ${erroNome ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"}`} />
                  {erroNome && <p className="text-red-500 text-[10px] font-black mt-1 uppercase">Nome obrigatório</p>}
                </div>
              )}

              {/* ALTERNANCIA DE FILTROS COM BASE NO MODO */}
              {modo === "profissoes" ? (
                <div className="mb-6">
                  <label className="block text-[10px] font-black text-purple-800 uppercase mb-1">Eixo Tecnológico EAD</label>
                  <select value={eixo} onChange={(e) => setEixo(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm font-bold bg-gray-50 outline-none text-gray-900 cursor-pointer">
                    <option value="Geral">Geral (Todos os Cursos)</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Gestão e Negócios">Gestão e Negócios</option>
                    <option value="Saúde, Turismo e Design">Saúde, Turismo e Design</option>
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Modalidade</label>
                    <select value={modalidade} onChange={(e) => setModalidade(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2 text-xs font-bold bg-gray-50 outline-none text-gray-900"><option value="Kids">Kids</option><option value="Teens">Teens & Adults</option></select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Etapa</label>
                    <select value={etapa} onChange={(e) => setEtapa(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2 text-xs font-bold bg-gray-50 outline-none text-gray-900"><option value="Escolar">Escolar</option><option value="Final">Final</option></select>
                  </div>
                </div>
              )}

              <button type="button" onClick={iniciarJogo} className={`w-full font-black py-4 rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${modo === "superbee" ? "bg-[#f59e0b] text-black" : modo === "jovens" ? "bg-[#00458c] text-white" : "bg-purple-700 text-white"}`}>COMEÇAR DINÂMICA →</button>
              
              <div className="flex justify-between mt-4">
                <button type="button" onClick={abrirPlacar} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer">🏆 Ver Placar</button>
                <Link href="/admin" className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer flex items-center gap-1">⚙️ Acessar Admin</Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-center mb-6 uppercase">🏆 Hall da Fama</h2>
              <div className="space-y-2 mb-6">
                {ranking.length === 0 ? (
                  <p className="text-center text-xs font-bold text-gray-400 py-6">Placar vazio!</p>
                ) : (
                  ranking.slice(0, 5).map((jogador, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="font-black text-gray-400 text-sm">{i + 1}º</span>
                      <span className="font-black text-sm uppercase flex-1 ml-4 truncate text-gray-800">{jogador.nome}</span>
                      <span className="font-black text-green-600 ml-2">✓ {jogador.acertos}</span>
                    </div>
                  ))
                )}
              </div>
              <button type="button" onClick={() => setVerPlacar(false)} className="w-full bg-gray-800 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest cursor-pointer">← Voltar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}