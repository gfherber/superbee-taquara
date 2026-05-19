"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BANCO_SUPERBEE, BANCO_JOVENS, BANCO_PROFISSOES } from "@/data/bancoDePalavras";

const PADRAO_SUPERBEE = BANCO_SUPERBEE;
const PADRAO_JOVENS = BANCO_JOVENS;
const PADRAO_PROFISSOES = BANCO_PROFISSOES;

export default function AdminPage() {
  const fileInputRef = useRef(null);
  const [modoAtivo, setModoAtivo] = useState("superbee"); 
  const [categoria, setCategoria] = useState("");
  const [listaAtual, setListaAtual] = useState([]);
  
  const [inputResposta, setInputResposta] = useState("");
  const [inputPergunta, setInputPergunta] = useState("");

  const getOpcoesCategoria = () => {
    if (modoAtivo === "profissoes") return ["Geral", "Tecnologia", "Gestão e Negócios", "Saúde, Turismo e Design"];
    return ["Kids-Escolar", "Kids-Final", "Teens-Escolar", "Teens-Final"];
  };

  const getBancoPadrao = () => {
    if (modoAtivo === "superbee") return PADRAO_SUPERBEE;
    if (modoAtivo === "jovens") return PADRAO_JOVENS;
    return PADRAO_PROFISSOES;
  };

  // Função para limpar dados "sujos" do localStorage
  const sanitizarItem = (item) => {
    if (typeof item === 'object' && item !== null) return item; // Para Profissões (que são objetos)
    if (typeof item !== 'string') return String(item);
    // Se a string contiver vírgulas, pegamos a última parte (a palavra real)
    if (item.includes(',')) {
      const partes = item.split(',');
      return partes[partes.length - 1].replace(/"/g, '').trim();
    }
    return item.replace(/"/g, '').trim();
  };

  useEffect(() => {
    const cats = getOpcoesCategoria();
    setCategoria(cats[0]);
  }, [modoAtivo]);

  const carregarLista = () => {
    if (!categoria) return;
    const chaveLS = `custom_words_${modoAtivo}`;
    const dadosLS = JSON.parse(localStorage.getItem(chaveLS) || "{}");
    const padrao = getBancoPadrao();
    
    // Aplica a limpeza nos dados carregados
    const rawList = dadosLS[categoria] || padrao[categoria] || [];
    const listaLimpa = rawList.map(item => {
        if (typeof item === 'string') return sanitizarItem(item);
        return item;
    });
    setListaAtual(listaLimpa);
  };

  useEffect(() => { carregarLista(); }, [modoAtivo, categoria]);

  const salvarNoLS = (novaLista) => {
    const chaveLS = `custom_words_${modoAtivo}`;
    const dadosLS = JSON.parse(localStorage.getItem(chaveLS) || "{}");
    dadosLS[categoria] = novaLista;
    localStorage.setItem(chaveLS, JSON.stringify(dadosLS));
    setListaAtual(novaLista);
  };

  const handleAdicionar = (e) => {
    e.preventDefault();
    if (modoAtivo === "profissoes") {
      if (!inputPergunta.trim() || !inputResposta.trim()) return;
      salvarNoLS([...listaAtual, { pergunta: inputPergunta.trim(), resposta: inputResposta.trim() }]);
      setInputPergunta(""); setInputResposta("");
    } else {
      const formatada = inputResposta.trim();
      if (!formatada) return;
      salvarNoLS([...listaAtual, formatada]);
      setInputResposta("");
    }
  };

  const handleRemover = (index) => {
    const atualizada = [...listaAtual];
    atualizada.splice(index, 1);
    salvarNoLS(atualizada);
  };

  const gerarCSV = () => {
    let csvContent = modoAtivo === "profissoes" ? "Pergunta,Resposta\n" : "Palavra\n";
    listaAtual.forEach(item => {
      if (modoAtivo === "profissoes") {
        csvContent += `"${item.pergunta.replace(/"/g, '""')}","${item.resposta.replace(/"/g, '""')}"\n`;
      } else {
        csvContent += `"${String(item).replace(/"/g, '""')}"\n`;
      }
    });
    const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${modoAtivo}_${categoria}.csv`;
    link.click();
  };

  const parseCSVLine = (text) => {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"' && text[i+1] === '"') { cell += '"'; i++; }
        else if (char === '"') { inQuotes = !inQuotes; }
        else if (char === ',' && !inQuotes) { row.push(cell); cell = ''; }
        else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && text[i+1] === '\n') i++;
            row.push(cell); rows.push(row); row = []; cell = '';
        }
        else { cell += char; }
    }
    if (cell || text[text.length-1] === ',') row.push(cell);
    if (row.length > 0) rows.push(row);
    return rows;
  };

  const importarCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = parseCSVLine(event.target.result);
      if (rows.length < 2) return alert("Arquivo vazio.");
      const novaLista = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (modoAtivo === "profissoes") {
          if (row.length >= 2) novaLista.push({ pergunta: row[0], resposta: row[1] });
        } else {
          // Limpa ao importar também
          if (row.length >= 1) novaLista.push(sanitizarItem(row[row.length - 1]));
        }
      }
      salvarNoLS(novaLista);
      alert("Importado com sucesso!");
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6 text-gray-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-white rounded-3xl shadow-lg p-8 flex flex-col h-fit">
          <Link href="/" className="text-sm font-black text-gray-400 uppercase hover:text-gray-600 mb-6 flex items-center gap-2">← Voltar ao Menu</Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Centro de Comando</h1>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col gap-4 mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Exportar & Importar</h3>
            <button type="button" onClick={gerarCSV} className="bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl uppercase text-xs tracking-wider shadow-md transition">📥 Baixar (CSV)</button>
            <button type="button" onClick={() => fileInputRef.current.click()} className="bg-gray-800 hover:bg-gray-900 text-white font-black py-3 rounded-xl uppercase text-xs tracking-wider shadow-md transition">📤 Subir (CSV)</button>
            <input type="file" accept=".csv" ref={fileInputRef} onChange={importarCSV} className="hidden" />
          </div>
        </div>

        <div className="w-full md:w-2/3 bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8 border-b border-gray-100 pb-6">
            <div className="flex-1">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Selecione o Jogo</label>
              <select value={modoAtivo} onChange={(e) => setModoAtivo(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-black uppercase text-sm outline-none cursor-pointer">
                <option value="superbee">Super Bee</option>
                <option value="jovens">Jovens Aprendizes</option>
                <option value="profissoes">Profissões EAD</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Categoria</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-black uppercase text-sm outline-none cursor-pointer">
                {getOpcoesCategoria().map(op => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>
          </div>

          <form onSubmit={handleAdicionar} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Adicionar Manualmente</h3>
            {modoAtivo === "profissoes" && (
              <input type="text" value={inputPergunta} onChange={(e) => setInputPergunta(e.target.value)} placeholder="Pergunta..." className="w-full border border-gray-200 rounded-xl p-4 font-bold text-sm outline-none" />
            )}
            <div className="flex gap-2">
              <input type="text" value={inputResposta} onChange={(e) => setInputResposta(e.target.value)} placeholder={modoAtivo === "profissoes" ? "Resposta..." : "Palavra..."} className="flex-1 border border-gray-200 rounded-xl p-4 font-black uppercase text-sm outline-none" />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 rounded-xl uppercase text-xs">Salvar</button>
            </div>
          </form>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Lista Atual ({listaAtual.length} itens)</h3>
            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2">
              {listaAtual.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  {modoAtivo === "profissoes" ? (
                    <div className="flex flex-col"><span className="font-bold text-xs text-gray-500">"{item.pergunta}"</span><span className="font-black text-sm uppercase text-purple-700">{item.resposta}</span></div>
                  ) : (
                    <span className="font-black text-sm uppercase text-gray-800">{item}</span>
                  )}
                  <button type="button" onClick={() => handleRemover(index)} className="bg-red-50 text-red-500 w-8 h-8 rounded-lg font-black">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}