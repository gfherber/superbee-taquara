"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const TODOS_CURSOS_SENAC = [
  "Técnico em Desenvolvimento de Sistemas",
  "Técnico em Administração",
  "Técnico em Contabilidade",
  "Técnico em Logística",
  "Técnico em Recursos Humanos",
  "Técnico em Transações Imobiliárias",
  "Técnico em Qualidade",
  "Técnico em Segurança do Trabalho",
  "Especialização Técnica em Segurança do Trabalho em Meio Ambiente",
  "Técnico em Design de Interiores",
  "Técnico em Guia de Turismo",
  "Técnico em Meio Ambiente",
  "Técnico em Óptica"
];

const BANCO_PROFISSOES = {
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
    { pergunta: "Profissional focado no domínio de algoritmos, estruturas de dados, methodologies ágeis (como Scrum) e arquitetura modular de softwares.", resposta: "Técnico em Desenvolvimento de Sistemas" },
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
    { pergunta: "Conhecido no mercado imobiliário como corretor, esse especialista avalia padrões de moradia, apresenta imóveis e redige contratos de locação ou venda.", resposta: "Técnico em Transações Imobiliárias" },
    { pergunta: "Profissional que avalia processos produtivos, aplica ferramentas estatísticas e auditorias para garantir conformidade e normas de padronização.", resposta: "Técnico em Qualidade" },
    { pergunta: "Seu papel é certificar que os produtos e serviços de uma organização sigam padrões de excelência e normas internacionais reconhecidas.", resposta: "Técnico em Qualidade" }
  ],
  "Saúde, Turismo e Design": [
    { pergunta: "Profissional focado em identificar riscos de acidentes, orientar o uso de EPIs e implementar políticas de prevenção contra sinistros ocupacionais.", resposta: "Técnico em Segurança do Trabalho" },
    { pergunta: "Responsável por inspecionar locais de trabalho e zelar pela integridade física e saúde de todos os colaboradores.", resposta: "Técnico em Segurança do Trabalho" },
    { pergunta: "Curso de nível de especialização com 300h voltado para o profissional que deseja aprofundar conhecimentos em gestão de impactos e riscos ecológicos industriais.", resposta: "Especialização Técnica em Segurança do Trabalho em Meio Ambiente" },
    { pergunta: "Formação focada em profissionais de segurança que buscam se diferenciar no mercado atuando com sustentabilidade corporativa, controle de resíduos e auditoria ambiental.", resposta: "Especialização Técnica em Segurança do Trabalho em Meio Ambiente" },
    { pergunta: "Profissional que planeja e organiza espaços internos residenciais ou comerciais, aliando estética, conforto e funcionalidade.", resposta: "Técnico em Design de Interiores" },
    { pergunta: "Cria conceitos de iluminação, escolha de mobiliário e paletas de cores para transformar ambientes internos de forma harmoniosa.", resposta: "Técnico em Design de Interiores" },
    { pergunta: "Responsável por acompanhar, orientar e transmitir informações de cunho histórico e cultural a pessoas ou grupos em roteiros de viagens.", resposta: "Técnico em Guia de Turismo" },
    { pergunta: "Lidera excursões garantindo o bem-estar dos viajantes e promovendo de forma ética o patrimônio local de uma região.", resposta: "Técnico em Guia de Turismo" },
    { pergunta: "Executa ações de controle, monitoramento e preservação ambiental, avaliando impactos, destinação de resíduos e recursos naturais.", resposta: "Técnico em Meio Ambiente" },
    { pergunta: "Coleta amostras de água e solo, desenvolve relatórios técnicos de impacto ecológico e cria programas de educação voltados à sustentabilidade.", resposta: "Técnico em Meio Ambiente" },
    { pergunta: "Profissional focado na fabricação, montagem, adaptação e comercialização de lentes oftálmicas, óculos corretivos e lentes de contato.", resposta: "Técnico em Óptica" },
    { pergunta: "Gerencia laboratórios de visão, interpreta receitas oftalmológicas e orienta o cliente na escolha correta de lentes.", resposta: "Técnico em Óptica" }
  ]
};

const emba = (arr) => [...arr].sort(() => Math.random() - 0.5);

function JogoProfissoesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef(null);

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
  
  // Controle de Rodadas do Modo Equipes
  const [rodadaAtual, setRodadaAtual] = useState(1);
  const TOTAL_RODADAS = 3;

  useEffect(() => {
    const dadosLS = JSON.parse(localStorage.getItem("custom_words_profissoes") || "{}");
    let listaFiltro = [];

    if (eixo === "Geral") {
      const tec = (dadosLS["Tecnologia"] && dadosLS["Tecnologia"].length > 0) ? dadosLS["Tecnologia"] : BANCO_PROFISSOES["Tecnologia"];
      const ges = (dadosLS["Gestão e Negócios"] && dadosLS["Gestão e Negócios"].length > 0) ? dadosLS["Gestão e Negócios"] : BANCO_PROFISSOES["Gestão e Negócios"];
      const sau = (dadosLS["Saúde, Turismo e Design"] && dadosLS["Saúde, Turismo e Design"].length > 0) ? dadosLS["Saúde, Turismo e Design"] : BANCO_PROFISSOES["Saúde, Turismo e Design"];
      const ger = (dadosLS["Geral"] && dadosLS["Geral"].length > 0) ? dadosLS["Geral"] : BANCO_PROFISSOES["Geral"];
      listaFiltro = [...tec, ...ges, ...sau, ...ger];
    } else {
      listaFiltro = (dadosLS[eixo] && dadosLS[eixo].length > 0) ? dadosLS[eixo] : BANCO_PROFISSOES[eixo] || [];
    }
    
    const carregados = listaFiltro.map(item => {
      const errados = TODOS_CURSOS_SENAC.filter(c => c !== item.resposta);
      const erradosSorteados = emba(errados).slice(0, 2);
      return {
        ...item,
        opcoes: emba([item.resposta, ...erradosSorteados]),
        status: "pendente"
      };
    });
    
    setDesafios(emba(carregados));
  }, [eixo]);

  const acertosTotal = desafios.filter(d => d.status === "acerto").length;

  const validarResposta = (opcaoEscolhida) => {
    if (statusFeedback || fimDeJogo) return;
    
    const certa = desafios[indiceAtual].resposta.toLowerCase().trim();
    const escolhida = opcaoEscolhida.toLowerCase().trim();
    const novas = [...desafios];

    if (escolhida === certa) {
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
    setDesafios(novas);
  };

  const avancar = () => {
    setStatusFeedback(null);
    setMostrarPalavra(false);
    setTempo(15);

    if (modoEquipes) {
      const proximaEquipe = turnoEquipe + 1;
      if (proximaEquipe < nomesEquipes.length) {
        setTurnoEquipe(proximaEquipe);
      } else {
        if (rodadaAtual < TOTAL_RODADAS) {
          setRodadaAtual(rodadaAtual + 1);
          setTurnoEquipe(0);
        } else {
          setFimDeJogo(true);
          return;
        }
      }
    } else {
      // Modo Individual: Trava tradicional em 10 perguntas
      if (indiceAtual >= 9) {
        setFimDeJogo(true);
        return;
      }
    }

    if (indiceAtual < desafios.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      setFimDeJogo(true);
    }
  };

  const pularDesafio = () => {
    setMostrarPalavra(false);
    setTempo(15);

    if (modoEquipes) {
      const proximaEquipe = turnoEquipe + 1;
      if (proximaEquipe < nomesEquipes.length) {
        setTurnoEquipe(proximaEquipe);
      } else {
        if (rodadaAtual < TOTAL_RODADAS) {
          setRodadaAtual(rodadaAtual + 1);
          setTurnoEquipe(0);
        } else {
          setFimDeJogo(true);
          return;
        }
      }
    } else {
      if (indiceAtual >= 9) {
        setFimDeJogo(true);
        return;
      }
    }

    if (indiceAtual < desafios.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      setFimDeJogo(true);
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
    } else if (tempo === 0 && !fimDeJogo && !statusFeedback) {
      const novas = [...desafios];
      novas[indiceAtual].status = "erro";
      setStatusFeedback('erro');
      setDesafios(novas);
    }
  }, [tempo, statusFeedback, fimDeJogo, desafios, indiceAtual]);

  // Lógica Avançada de Distribuição de Posições do Pódio (Tratamento de Empates)
  const obterDadosPodio = () => {
    const mapeado = nomesEquipes.map((nome, i) => ({ nome, score: scores[i] }));
    mapeado.sort((a, b) => b.score - a.score);

    let rankAtual = 1;
    const ranqueado = mapeado.map((item, idx) => {
      if (idx > 0 && item.score < mapeado[idx - 1].score) {
        rankAtual = idx + 1;
      }
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
      
      {/* BARRA LATERAL: PLACAR DE EQUIPES */}
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
                  turnoEquipe === i ? 'bg-white scale-105 border-cyan-400 shadow-2xl' : 'bg-white/10 border-transparent opacity-50 hover:bg-white/20'
                }`}
              >
                <div className="flex flex-col truncate mr-2">
                  <span className={`text-[9px] font-black uppercase ${turnoEquipe === i ? 'text-purple-800 animate-pulse' : 'text-white'}`}>
                    {turnoEquipe === i ? '• Respondendo' : 'Clique p/ selecionar'}
                  </span>
                  <span className={`text-lg font-black uppercase truncate max-w-[130px] ${turnoEquipe === i ? 'text-gray-900' : 'text-white'}`}>
                    {nome}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={(e) => { e.stopPropagation(); ajustarScoreManual(i, 1); }} className={`w-6 h-5 rounded text-xs font-black flex items-center justify-center transition ${turnoEquipe === i ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-white/20 text-white'}`}>+</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); ajustarScoreManual(i, -1); }} className={`w-6 h-5 rounded text-xs font-black flex items-center justify-center transition ${turnoEquipe === i ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-white/20 text-white'}`}>-</button>
                  </div>
                  <span className={`text-4xl font-black w-10 text-center ${turnoEquipe === i ? 'text-purple-700' : 'text-white'}`}>
                    {scores[i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-10 text-white/30 text-center text-xs font-bold uppercase tracking-widest">
            Senac EAD
          </div>
        </div>
      )}

      {/* PALCO CENTRAL */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 relative">
        <Link href="/" className="absolute top-6 right-6 border border-white text-white px-4 py-2 rounded-lg font-black text-xs uppercase hover:bg-white hover:text-purple-900 transition z-50 shadow-md">
          Sair
        </Link>

        {/* CRONÔMETRO INDIVIDUAL */}
        <div className={`bg-white/10 border border-white/20 px-8 py-2 rounded-full font-black text-3xl text-white mb-6 shadow-2xl backdrop-blur-sm transition-colors ${tempo <= 5 && !statusFeedback ? 'text-red-400 border-red-500 animate-pulse' : ''}`}>
          ⏱ {Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}
        </div>

        <div className="w-full max-w-[850px] z-10">
          {fimDeJogo ? (
            /* TELA FINAL: VISUAL COMPLETO DO PÓDIO PROFISSIONAL PARA PROJETOR */
            <div className="bg-white rounded-[40px] shadow-2xl p-10 flex flex-col items-center w-full max-w-[800px] mx-auto animate-in zoom-in duration-300">
              <h2 className="text-4xl font-black text-gray-800 mb-1 uppercase tracking-tight">Trilha Concluída!</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-12">Classificação Final das Equipes</p>
              
              {modoEquipes ? (
                <div className="w-full flex flex-col items-center">
                  
                  {/* Estrutura de Degraus do Pódio */}
                  <div className="flex items-end justify-center w-full max-w-[600px] h-[280px] mb-10 px-4">
                    
                    {/* 2º LUGAR (PRATA) - ESQUERDA */}
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-center mb-2 px-2 max-w-[140px] truncate">
                        {podio.segundos.map((e, idx) => (
                          <p key={idx} className="font-black text-sm uppercase text-gray-700 truncate">{e.nome}</p>
                        ))}
                        {podio.segundos.length === 0 && <p className="text-gray-300 text-xs font-bold italic">--</p>}
                      </div>
                      <div className="w-full bg-slate-300 border-t-4 border-slate-400 rounded-t-2xl h-[130px] flex flex-col items-center justify-center shadow-md">
                        <span className="text-4xl">🥈</span>
                        <span className="text-xs font-black text-slate-700 uppercase mt-1">2º Lugar</span>
                        {podio.segundos.length > 0 && <span className="text-lg font-black text-slate-800 mt-1">{podio.segundos[0].score} pts</span>}
                      </div>
                    </div>

                    {/* 1º LUGAR (OURO) - CENTRO BRILHANTE */}
                    <div className="flex-1 flex flex-col items-center scale-105 z-10">
                      <div className="text-center mb-2 px-2 max-w-[160px] truncate">
                        {podio.primeiros.map((e, idx) => (
                          <p key={idx} className="font-black text-base uppercase text-yellow-600 truncate animate-pulse">{e.nome}</p>
                        ))}
                        {podio.primeiros.length === 0 && <p className="text-gray-300 text-xs font-bold italic">--</p>}
                      </div>
                      <div className="w-full bg-yellow-400 border-t-4 border-yellow-500 rounded-t-2xl h-[190px] flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/40 animate-pulse" />
                        <span className="text-5xl">🥇</span>
                        <span className="text-xs font-black text-yellow-800 uppercase mt-1 tracking-wider">1º Lugar</span>
                        {podio.primeiros.length > 0 && <span className="text-xl font-black text-yellow-950 mt-1">{podio.primeiros[0].score} pts</span>}
                      </div>
                    </div>

                    {/* 3º LUGAR (BRONZE) - DIREITA */}
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-center mb-2 px-2 max-w-[140px] truncate">
                        {podio.terceiros.map((e, idx) => (
                          <p key={idx} className="font-black text-sm uppercase text-gray-700 truncate">{e.nome}</p>
                        ))}
                        {podio.terceiros.length === 0 && <p className="text-gray-300 text-xs font-bold italic">--</p>}
                      </div>
                      <div className="w-full bg-amber-600 border-t-4 border-amber-700 rounded-t-2xl h-[90px] flex flex-col items-center justify-center shadow-md">
                        <span className="text-3xl">🥉</span>
                        <span className="text-[10px] font-black text-amber-100 uppercase mt-1">3º Lugar</span>
                        {podio.terceiros.length > 0 && <span className="text-base font-black text-amber-950 mt-0.5">{podio.terceiros[0].score} pts</span>}
                      </div>
                    </div>

                  </div>

                  {/* Demais posições ou pontuações zeradas listadas abaixo */}
                  {podio.restante.length > 0 && (
                    <div className="w-full max-w-[500px] border-t border-gray-100 pt-4 space-y-2">
                      {podio.restante.map((e, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                          <span className="font-black text-xs text-gray-400 uppercase tracking-wider">Mesa de Jogo</span>
                          <span className="font-black text-sm text-gray-700 uppercase truncate max-w-[200px]">{e.nome}</span>
                          <span className="font-black text-sm text-gray-500">{e.score} pts</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ) : (
                <div className="my-6">
                  <span className="text-6xl font-black text-purple-600">✓ {acertosTotal}</span>
                  <p className="text-gray-400 font-black text-xs uppercase mt-3 tracking-widest">Cursos acertados por {nomeCompetidor}</p>
                </div>
              )}

              <button type="button" onClick={() => router.push('/')} className="w-full bg-purple-700 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-purple-800 transition uppercase tracking-widest mt-8 text-sm">
                Voltar ao Menu principal
              </button>
            </div>
          ) : !statusFeedback ? (
            <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 flex flex-col items-center relative border-b-[10px] border-gray-200">
               
               {/* INDICADORES MÚLTIPLOS DE RODADA E VEZ */}
               <div className="flex gap-2 mb-4">
                  {modoEquipes && (
                    <div className="bg-purple-700 text-white px-6 py-1.5 rounded-full font-black text-xs uppercase shadow-sm tracking-wider">
                      Rodada {rodadaAtual} de {TOTAL_RODADAS} | Faltam {TOTAL_RODADAS - rodadaAtual}
                    </div>
                  )}
                  {modoEquipes && (
                    <div className="bg-cyan-400 text-black px-6 py-1.5 rounded-full font-black text-xs uppercase shadow-sm tracking-wider">
                      Vez de: {nomesEquipes[turnoEquipe]}
                    </div>
                  )}
                  {!modoEquipes && (
                    <div className="bg-purple-700 text-white px-6 py-1.5 rounded-full font-black text-xs uppercase tracking-wider">
                      Pergunta {indiceAtual + 1} de 10
                    </div>
                  )}
               </div>
              
              <p className="text-gray-400 font-black text-xs mb-4 uppercase tracking-widest italic">
                Qual é o curso técnico correspondente?
              </p>

              <div className="min-h-[140px] flex items-center justify-center text-center px-4 mb-6">
                <h2 className="text-xl md:text-2xl font-black text-gray-800 leading-snug tracking-tight">
                  "{desafios[indiceAtual]?.pergunta}"
                </h2>
              </div>

              {mostrarPalavra && (
                <div className="mb-4 bg-purple-50 border border-purple-200 text-purple-900 font-black text-sm uppercase px-4 py-2 rounded-xl">
                  Gabarito: {desafios[indiceAtual]?.resposta}
                </div>
              )}

              {/* OPCÕES PARA MULTIPLA ESCOLHA */}
              <div className="w-full flex flex-col gap-3 mb-6">
                {desafios[indiceAtual]?.opcoes?.map((opcao, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => validarResposta(opcao)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 text-sm md:text-base font-black uppercase text-gray-800 hover:bg-purple-50 hover:border-purple-500 transition-all shadow-sm text-center"
                  >
                    {opcao}
                  </button>
                ))}
              </div>
                
              <div className="flex gap-2 w-full">
                <button type="button" onClick={() => setMostrarPalavra(!mostrarPalavra)} className="flex-1 bg-gray-100 border border-gray-300 py-3 rounded-xl font-black text-gray-700 hover:bg-gray-200 transition uppercase text-xs">👁️ Ver Gabarito</button>
                <button type="button" onClick={pularDesafio} className="flex-1 bg-amber-100 border border-amber-300 py-3 rounded-xl font-black text-amber-700 hover:bg-amber-200 transition uppercase text-xs">➡️ Pular</button>
              </div>
            </div>
          ) : (
            <div className={`rounded-[50px] shadow-2xl p-16 flex flex-col items-center justify-center border-8 border-white/20 w-full ${statusFeedback === 'acerto' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}>
              <h2 className="text-6xl md:text-8xl font-black text-white mb-6 text-center uppercase tracking-tighter">
                {statusFeedback === 'acerto' ? 'Ponto! 🎉' : 'Tempo Esgotado / Erro! ✕'}
              </h2>
              <p className="text-white font-bold text-lg mb-8 uppercase tracking-wide text-center">
                A resposta certa é: {desafios[indiceAtual]?.resposta}
              </p>
              <button 
                type="button"
                onClick={avancar}
                className="bg-white text-black font-black text-2xl px-16 py-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
              >
                Continuar ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JogoProfissoes() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-900 flex items-center justify-center text-white font-black text-2xl">Carregando Arena EAD...</div>}>
      <JogoProfissoesContent />
    </Suspense>
  );
}