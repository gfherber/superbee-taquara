"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// BANCOS PADRÕES COM 10 PERGUNTAS POR EIXO EAD
const PADRAO_SUPERBEE = { "Kids-Escolar": ["apple", "blue", "dog"], "Kids-Final": ["butterfly", "garden"], "Teens-Escolar": ["action", "actor"], "Teens-Final": ["challenge", "experience"] };
const PADRAO_JOVENS = { "Kids-Escolar": ["work", "team"], "Kids-Final": ["office", "worker"], "Teens-Escolar": ["company", "meeting"], "Teens-Final": ["interview", "business"] };
const PADRAO_PROFISSOES = {
  "Geral": [
    { pergunta: "Profissional estratégico que atua na elaboração de planos de cargos, salários e dinâmicas de engajamento da equipe.", resposta: "Técnico em Recursos Humanos" },
    { pergunta: "Se o banco de dados da empresa caiu ou o sistema precisa de uma nova funcionalidade, é esse o profissional acionado.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Braço direito dos gestores, atua de forma versátil coordenando documentos, agendas e o fluxo de comunicação interna da empresa.", resposta: "Técnico em Administração" },
    { pergunta: "Especialista em evitar desperdícios no estoque e garantir que o produto chegue ao cliente no prazo correto.", resposta: "Técnico em Logística" },
    { pergunta: "Presta assessoria em financiamentos habitacionais e possui registro no CRECI para atuar legalmente no mercado.", resposta: "Técnico em Transações Imobiliárias" },
    { pergunta: "Profissional indispensável para garantir que a empresa esteja em dia com a Receita Federal e com a saúde financeira.", resposta: "Técnico em Contabilidade" },
    { pergunta: "Implementa métodos de melhoria contínua (como o 5S), garantindo que o cliente sempre receba um produto sem defeitos.", resposta: "Técnico em Qualidade" },
    { pergunta: "Profissional apaixonado por viagens que domina a história, geografia e a cultura local para encantar visitantes e turistas.", resposta: "Técnico em Guia de Turismo" },
    { pergunta: "Trabalha na elaboração de projetos de sustentabilidade e fiscaliza processos corporativos para que não poluam a natureza.", resposta: "Técnico em Meio Ambiente" },
    { pergunta: "Especialista que atende o cliente na clínica ou loja, fazendo ajustes precisos nas armações e recomendando as melhores lentes corretivas.", resposta: "Técnico em Óptica" }
  ],
  "Tecnologia": [
    { pergunta: "Profissional que analisa, projeta, desenvolve e testa sistemas, softwares e aplicativos utilizando linguagens de programação.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Responsável por criar códigos estruturados, construir bancos de dados relacionais e dar vida a plataformas digitais, sites e aplicativos.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Atua tanto no desenvolvimento front-end quanto no back-end, resolvendo problemas complexos através da lógica de computação.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Se você deseja aprender linguagens de mercado como JavaScript, Python ou Java para construir softwares corporativos, este é o curso ideal.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Trabalha estruturando a engenharia de requisitos de um sistema e codificando soluções inteligentes para a automação de processos digitais.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Profissional focado na manutenção de códigos existentes, criação de integrações via APIs e no gerenciamento de servidores locais ou em nuvem.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Especialista que transforma problemas e necessidades de negócios em linhas de código funcionais, prezando pela segurança de dados.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Nesta formação do Senac com carga horária de 1216 horas, o aluno se qualifica para programar computadores e desenvolver soluções web completas.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Profissional focado no domínio de algoritmos, estruturas de dados, metodologias ágeis (como Scrum) e arquitetura modular de softwares.", resposta: "Técnico em Desenvolvimento de Sistemas" },
    { pergunta: "Aquele que passa o dia imerso em ambientes de desenvolvimento (como editores de código), escrevendo rotinas lógicas e solucionando bugs de sistemas.", resposta: "Técnico em Desenvolvimento de Sistemas" }
  ],
  "Gestão e Negócios": [
    { pergunta: "Profissional que apoia a gestão organizacional, atuando em planejamento, análise de processos, compras, finanças e suporte administrativo geral.", resposta: "Técnico em Administração" },
    { pergunta: "Seu foco é a eficiência operacional de uma empresa, lidando com rotinas de escritório, controle de arquivos e organização de fluxos de trabalho.", resposta: "Técnico em Administração" },
    { pergunta: "Profissional que realiza lançamentos financeiros, auxilia na elaboração de balanços, guias de impostos e relatórios contábeis corporativos.", resposta: "Técnico em Contabilidade" },
    { pergunta: "Responsável por analisar custos, balancetes, livros fiscais e prestar suporte técnico no monitoramento financeiro e auditoria da empresa.", resposta: "Técnico em Contabilidade" },
    { pergunta: "Profissional responsável por planejar, operacionalizar e gerenciar as atividades de armazenamento, transporte, estoque e distribuição de produtos.", resposta: "Técnico em Logística" },
    { pergunta: "Atua diretamente na gestão da cadeia de suprimentos (supply chain), otimizando rotas de entrega, fretes e o recebimento de mercadorias.", resposta: "Técnico em Logística" },
    { pergunta: "Profissional que auxilia nos processos de recrutamento, seleção, treinamento, folha de pagamento e integração de novos colaboradores.", resposta: "Técnico em Recursos Humanos" },
    { pergunta: "Responsável por mediar as relações entre empresa e trabalhador, cuidando diretamente da gestão de talentos, benefícios e clima organizacional.", resposta: "Técnico em Recursos Humanos" },
    { pergunta: "Profissional habilitado para intermediar a compra, venda, permuta e locação de imóveis, prestando consultoria documental segura.", resposta: "Técnico em Transações Imobiliárias" },
    { pergunta: "Seu papel é certificar que os produtos e serviços de uma organização sigam padrões de excelência e normas internacionais reconhecidas.", resposta: "Técnico em Qualidade" }
  ],
  "Saúde, Turismo e Design": [
    { pergunta: "Profissional focado em identificar riscos de acidentes, orientar o uso de EPIs e implementar políticas de prevenção contra sinistros ocupacionais.", resposta: "Técnico em Segurança do Trabalho" },
    { pergunta: "Responsável por inspecionar locais de trabalho e zelar pela integridade física e saúde de todos os colaboradores.", resposta: "Técnico em Segurança do Trabalho" },
    { pergunta: "Curso de nível de especialização voltado para o profissional que deseja atuar em gestão de impactos e riscos ecológicos industriais.", resposta: "Especialização Técnica em Segurança do Trabalho em Meio Ambiente" },
    { pergunta: "Profissional que planeja e organiza espaços internos residenciais ou comerciais, aliando estética, conforto e funcionalidade.", resposta: "Técnico em Design de Interiores" },
    { pergunta: "Cria conceitos de iluminação, escolha de mobiliário e paletas de cores para transformar ambientes internos de forma harmoniosa.", resposta: "Técnico em Design de Interiores" },
    { pergunta: "Responsável por acompanhar, orientar e transmitir informações de cunho histórico e cultural a pessoas ou grupos em roteiros de viagens.", resposta: "Técnico em Guia de Turismo" },
    { pergunta: "Lidera excursões garantindo o bem-estar dos viajantes e promovendo de forma ética o patrimônio local de uma região.", resposta: "Técnico em Guia de Turismo" },
    { pergunta: "Executa ações de controle e preservação ambiental, avaliando impactos, destinação de resíduos e recursos naturais.", resposta: "Técnico em Meio Ambiente" },
    { pergunta: "Profissional focado na fabricação, montagem, adaptação e comercialização de lentes oftálmicas, óculos corretivos e lentes de contato.", resposta: "Técnico em Óptica" },
    { pergunta: "Gerencia laboratórios de visão, interpreta receitas oftalmológicas e orienta o cliente na escolha correta de lentes.", resposta: "Técnico em Óptica" }
  ]
};

export default function AdminPage() {
  const fileInputRef = useRef(null);
  const [modoAtivo, setModoAtivo] = useState("superbee"); 
  const [categoria, setCategoria] = useState("Kids-Escolar");
  const [listaAtual, setListaAtual] = useState([]);
  
  const [inputResposta, setInputResposta] = useState("");
  const [inputPergunta, setInputPergunta] = useState("");

  const getOpcoesCategoria = () => {
    if (modoAtivo === "profissoes") {
      return ["Geral", "Tecnologia", "Gestão e Negócios", "Saúde, Turismo e Design"];
    }
    return ["Kids-Escolar", "Kids-Final", "Teens-Escolar", "Teens-Final"];
  };

  useEffect(() => {
    if (modoAtivo === "profissoes") setCategoria("Geral");
    else setCategoria("Kids-Escolar");
  }, [modoAtivo]);

  const carregarLista = () => {
    const chaveLS = `custom_words_${modoAtivo}`;
    const dadosLS = JSON.parse(localStorage.getItem(chaveLS) || "{}");
    
    let dadosCategoria = dadosLS[categoria];
    if (!dadosCategoria) {
      if (modoAtivo === "superbee") dadosCategoria = PADRAO_SUPERBEE[categoria] || [];
      else if (modoAtivo === "jovens") dadosCategoria = PADRAO_JOVENS[categoria] || [];
      else dadosCategoria = PADRAO_PROFISSOES[categoria] || [];
    }
    
    setListaAtual(dadosCategoria);
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
      const formatada = inputResposta.trim().toLowerCase().replace(/\s/g, '');
      if (!formatada || listaAtual.includes(formatada)) return;
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
    let csvContent = "Modo,Categoria,Pergunta,Resposta\n";
    
    const lerBancoCompleto = (modoKey, fallback) => {
      const dados = JSON.parse(localStorage.getItem(`custom_words_${modoKey}`) || "{}");
      return Object.keys(dados).length > 0 ? dados : fallback;
    };

    const sBee = lerBancoCompleto("superbee", PADRAO_SUPERBEE);
    const jov = lerBancoCompleto("jovens", PADRAO_JOVENS);
    const prof = lerBancoCompleto("profissoes", PADRAO_PROFISSOES);

    const escape = (str) => `"${str.replace(/"/g, '""')}"`;

    const compilarSimples = (dados, modoNome) => {
      Object.keys(dados).forEach(cat => {
        dados[cat].forEach(palavra => {
          csvContent += `${escape(modoNome)},${escape(cat)},"",${escape(palavra)}\n`;
        });
      });
    };
    compilarSimples(sBee, "superbee");
    compilarSimples(jov, "jovens");

    Object.keys(prof).forEach(cat => {
      prof[cat].forEach(item => {
        csvContent += `${escape("profissoes")},${escape(cat)},${escape(item.pergunta)},${escape(item.resposta)}\n`;
      });
    });

    const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `senac_banco_dados_${new Date().toISOString().split('T')[0]}.csv`;
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
      if (rows.length < 2) return alert("Arquivo vazio ou inválido.");

      const novosSBee = {}; const novosJov = {}; const novosProf = {};

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 4) continue;
        const modo = row[0].trim();
        const cat = row[1].trim();
        const perg = row[2].trim();
        const resp = row[3].trim();

        if (modo === "superbee") {
          if (!novosSBee[cat]) novosSBee[cat] = [];
          novosSBee[cat].push(resp);
        } else if (modo === "jovens") {
          if (!novosJov[cat]) novosJov[cat] = [];
          novosJov[cat].push(resp);
        } else if (modo === "profissoes") {
          if (!novosProf[cat]) novosProf[cat] = [];
          novosProf[cat].push({ pergunta: perg, resposta: resp });
        }
      }

      localStorage.setItem("custom_words_superbee", JSON.stringify(novosSBee));
      localStorage.setItem("custom_words_jovens", JSON.stringify(novosJov));
      localStorage.setItem("custom_words_profissoes", JSON.stringify(novosProf));
      
      alert("Banco de dados importado com sucesso!");
      carregarLista();
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6 text-gray-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* PAINEL LATERAL DE CONTROLES */}
        <div className="w-full md:w-1/3 bg-white rounded-3xl shadow-lg p-8 flex flex-col h-fit">
          <Link href="/" className="text-sm font-black text-gray-400 uppercase hover:text-gray-600 mb-6 flex items-center gap-2">← Voltar ao Menu</Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Centro de Comando</h1>
          <p className="text-gray-500 text-sm font-bold mb-8">Gestão global de banco de palavras.</p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col gap-4 mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Exportar & Importar</h3>
            <button type="button" onClick={gerarCSV} className="bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl uppercase text-xs tracking-wider shadow-md transition">📥 Baixar Planilha (CSV)</button>
            <button type="button" onClick={() => fileInputRef.current.click()} className="bg-gray-800 hover:bg-gray-900 text-white font-black py-3 rounded-xl uppercase text-xs tracking-wider shadow-md transition">📤 Subir Planilha</button>
            <input type="file" accept=".csv" ref={fileInputRef} onChange={importarCSV} className="hidden" />
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100">
             <button type="button" onClick={() => {
                if(confirm("ATENÇÃO: Isso apagará todas as palavras cadastradas e restaurará os padrões de fábrica. Confirma?")) {
                  localStorage.removeItem("custom_words_superbee");
                  localStorage.removeItem("custom_words_jovens");
                  localStorage.removeItem("custom_words_profissoes");
                  carregarLista();
                }
             }} className="text-red-500 font-black text-xs uppercase hover:underline w-full text-center">⚠ Restaurar Padrões de Fábrica</button>
          </div>
        </div>

        {/* ÁREA DE GESTÃO MANUAL */}
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
              <input type="text" value={inputPergunta} onChange={(e) => setInputPergunta(e.target.value)} placeholder="Digite a Pergunta/Charada..." className="w-full border border-gray-200 rounded-xl p-4 font-bold text-sm outline-none focus:border-purple-500" />
            )}

            <div className="flex gap-2">
              <input type="text" value={inputResposta} onChange={(e) => setInputResposta(e.target.value)} placeholder={modoAtivo === "profissoes" ? "Resposta (Ex: Técnico em...)" : "Digite a Palavra..."} className="flex-1 border border-gray-200 rounded-xl p-4 font-black uppercase text-sm outline-none focus:border-blue-500" />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 rounded-xl uppercase text-xs tracking-wider transition">Salvar</button>
            </div>
          </form>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Lista Atual ({listaAtual.length} itens)</h3>
            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2">
              {listaAtual.length === 0 ? (
                <p className="text-sm font-bold text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center">Nenhum item cadastrado nesta categoria.</p>
              ) : (
                listaAtual.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:border-gray-300 transition">
                    {modoAtivo === "profissoes" ? (
                      <div className="flex flex-col pr-4">
                        <span className="font-bold text-xs text-gray-500 mb-1">"{item.pergunta}"</span>
                        <span className="font-black text-sm uppercase text-purple-700">{item.resposta}</span>
                      </div>
                    ) : (
                      <span className="font-black text-sm uppercase text-gray-800">{item}</span>
                    )}
                    <button type="button" onClick={() => handleRemover(index)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 rounded-lg font-black flex items-center justify-center transition ml-2 shrink-0">✕</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}