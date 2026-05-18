"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const BANCO_PROFISSOES = {
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
    { pergunta: "Conhecido no mercado imobiliário como corretor, esse especialista avalia padrões de moradia, apresenta imóveis e redige contratos de locação ou venda.", resposta: "Técnico em Transações Imobiliárias" },
    { pergunta: "Profissional que avalia processos produtivos, aplica ferramentas estatísticas e auditorias para garantir conformidade e normas de padronização.", resposta: "Técnico em Qualidade" },
    { pergunta: "Seu papel é certificar que os produtos e serviços de uma organização sigam padrões de excelência e normas internacionais reconhecidas, como a ISO 9001.", resposta: "Técnico em Qualidade" }
  ],
  "Saúde, Turismo e Design": [
    { pergunta: "Profissional focado em identificar riscos de acidentes, orientar o uso de EPIs, ministrar treinamentos e implementar políticas de prevenção contra sinistros ocupacionais.", resposta: "Técnico em Segurança do Trabalho" },
    { pergunta: "Responsável por inspecionar locais de trabalho, investigar causas de acidentes laborais e zelar pela integridade física e saúde de todos os colaboradores.", resposta: "Técnico em Segurança do Trabalho" },
    { pergunta: "Curso de nível de especialização com 300h voltado para o profissional que deseja aprofundar conhecimentos em gestão de impactos e riscos ecológicos industriais.", resposta: "Especialização Técnica em Segurança do Trabalho em Meio Ambiente" },
    { pergunta: "Formação focada em profissionais de segurança que buscam se diferenciar no mercado atuando com sustentabilidade corporativa, controle de resíduos e auditoria ambiental.", resposta: "Especialização Técnica em Segurança do Trabalho em Meio Ambiente" },
    { pergunta: "Profissional que planeja e organiza espaços internos residenciais ou comerciais, aliando estética, conforto, ergonomia e funcionalidade.", resposta: "Técnico em Design de Interiores" },
    { pergunta: "Cria conceitos inovadores de iluminação, escolha de mobiliário, texturas e paletas de cores para transformar ambientes internos de forma harmoniosa.", resposta: "Técnico em Design de Interiores" },
    { pergunta: "Profissional responsável por acompanhar, orientar e transmitir informações de cunho histórico e cultural a pessoas ou grupos em roteiros de viagens.", resposta: "Técnico em Guia de Turismo" },
    { pergunta: "Lidera excursões, roteiros urbanos ou ecológicos, garantindo o bem-estar dos viajantes e promovendo de forma ética o patrimônio local de uma região.", resposta: "Técnico em Guia de Turismo" },
    { pergunta: "Profissional que executa ações de controle, monitoramento e preservação ambiental, avaliando impactos, destinação de resíduos e recursos naturais.", resposta: "Técnico em Meio Ambiente" },
    { pergunta: "Coleta amostras de água e solo, desenvolve relatórios técnicos de impacto ecológico e cria programas de reciclagem e educação voltados à sustentabilidade.", resposta: "Técnico em Meio Ambiente" },
    { pergunta: "Profissional focado na fabricação, montagem, adaptação e comercialização de lentes oftálmicas, óculos corretivos e lentes de contato.", resposta: "Técnico em Óptica" },
    { pergunta: "Gerencia laboratórios e estabelecimentos de visão, interpreta receitas médicas oftalmológicas e orienta o cliente na escolha correta de lentes e tratamentos.", resposta: "Técnico em Óptica" }
  ]
};

function JogoProfissoesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef(null);
  const lockTeclado = useRef(false);

  const eixo = searchParams.get('eixo') || "Geral";
  const nomeCompetidor = searchParams.get('nome') || "Anônimo";
  
  const equipesParam = searchParams.get('equipes');
  const nomesEquipes = equipesParam ? equipesParam.split(',') : [];
  const modoEquipes = nomesEquipes.length > 0;

  const [tempo, setTempo] = useState(120); 
  const [desafios, setDesafios] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [digitado, setDigitado] = useState("");
  const [mostrarPalavra, setMostrarPalavra] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null); 
  const [fimDeJogo, setFimDeJogo] = useState(false);

  const [scores, setScores] = useState(nomesEquipes.map(() => 0));
  const [turnoEquipe, setTurnoEquipe] = useState(0);

  const embaralhar = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    let listaFiltro = [];
    if (eixo === "Geral") {
      listaFiltro = [
        ...BANCO_PROFISSOES["Tecnologia"],
        ...BANCO_PROFISSOES["Gestão e Negócios"],
        ...BANCO_PROFISSOES["Saúde, Turismo e Design"]
      ];
    } else {
      listaFiltro = BANCO_PROFISSOES[eixo] || [];
    }
    
    const carregados = listaFiltro.map(item => ({
      ...item,
      status: "pendente"
    }));
    
    setDesafios(embaralhar(carregados));
  }, [eixo]);

  const acertosTotal = desafios.filter(d => d.status === "acerto").length;

  const normalizarTexto = (txt) => {
    return txt
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const validarResposta = () => {
    if (!digitado || statusFeedback || fimDeJogo) return;
    
    const certa = normalizarTexto(desafios[indiceAtual].resposta);
    const digitada = normalizarTexto(digitado);
    const novas = [...desafios];

    if (digitada === certa || (certa.includes(digitada) && digitada.length > 10)) {
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

    if (indiceAtual < desafios.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      setFimDeJogo(true);
    }
  };

  const pularDesafio = () => {
    setDigitado("");
    setMostrarPalavra(false);
    if (modoEquipes) {
      setTurnoEquipe((turnoEquipe + 1) % nomesEquipes.length);
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
    } else if (tempo === 0 && !fimDeJogo) {
      setFimDeJogo(true);
    }
  }, [tempo, statusFeedback, fimDeJogo]);

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

        <div className="bg-white/10 border border-white/20 px-8 py-2 rounded-full font-black text-3xl text-white mb-8 shadow-2xl backdrop-blur-sm">
          ⏱ {Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}
        </div>

        <div className="w-full max-w-[850px] z-10">
          {fimDeJogo ? (
            <div className="bg-white rounded-[40px] shadow-2xl p-12 flex flex-col items-center text-center">
              <span className="text-8xl mb-6">🏁</span>
              <h2 className="text-4xl font-black text-gray-800 mb-2 uppercase">Fim da Trilha EAD!</h2>
              
              {modoEquipes ? (
                <div className="w-full mt-8 space-y-4">
                  <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-4">Pontuação Final</p>
                  {nomesEquipes.map((nome, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                      <span className="font-black uppercase text-gray-700">{nome}</span>
                      <span className="text-3xl font-black text-purple-600">{scores[i]} pts</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="my-6">
                  <span className="text-5xl font-black text-purple-600">✓ {acertosTotal}</span>
                  <p className="text-gray-400 font-black text-xs uppercase mt-2">Cursos identificados por {nomeCompetidor}</p>
                </div>
              )}

              <button type="button" onClick={() => router.push('/')} className="w-full bg-purple-700 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-purple-800 transition uppercase tracking-widest mt-8">
                Voltar ao Menu principal
              </button>
            </div>
          ) : !statusFeedback ? (
            <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 flex flex-col items-center relative border-b-[10px] border-gray-200">
               {modoEquipes && (
                  <div className="bg-cyan-400 text-black px-8 py-1.5 rounded-full font-black text-sm uppercase mb-6 shadow-md tracking-wider">
                    Vez de: {nomesEquipes[turnoEquipe]}
                  </div>
                )}
              
              <p className="text-gray-400 font-black text-xs mb-4 uppercase tracking-widest italic">
                Qual é o curso técnico correspondente?
              </p>

              <div className="min-h-[140px] flex items-center justify-center text-center px-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 leading-snug tracking-tight">
                  "{desafios[indiceAtual]?.pergunta}"
                </h2>
              </div>

              {mostrarPalavra && (
                <div className="mb-6 bg-purple-50 border border-purple-200 text-purple-900 font-black text-sm uppercase px-4 py-2 rounded-xl">
                  Gabarito: {desafios[indiceAtual]?.resposta}
                </div>
              )}

              <div className="w-full flex flex-col gap-4">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={digitado}
                  onChange={(e) => setDigitado(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && validarResposta()}
                  placeholder="DIGITE AQUI: TÉCNICO EM..." 
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 text-xl md:text-2xl text-center font-black uppercase outline-none focus:border-purple-500 focus:bg-white text-gray-950 placeholder:text-gray-400 shadow-inner"
                  autoFocus
                />
                
                <div className="flex gap-2">
                  <button type="button" onClick={() => setMostrarPalavra(!mostrarPalavra)} className="flex-1 bg-gray-100 border border-gray-300 py-4 rounded-xl font-black text-gray-700 hover:bg-gray-200 transition uppercase text-xs">👁️ Ver Gabarito</button>
                  <button type="button" onClick={validarResposta} className="flex-[2] bg-purple-700 text-white py-4 rounded-xl font-black hover:bg-purple-800 transition uppercase text-xs shadow-md tracking-wider">✓ Validar Resposta</button>
                  <button type="button" onClick={pularDesafio} className="flex-1 bg-amber-100 border border-amber-300 py-4 rounded-xl font-black text-amber-700 hover:bg-amber-200 transition uppercase text-xs">➡️ Pular</button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-[50px] shadow-2xl p-16 flex flex-col items-center justify-center border-8 border-white/20 w-full ${statusFeedback === 'acerto' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}>
              <h2 className="text-6xl md:text-8xl font-black text-white mb-6 text-center uppercase tracking-tighter">
                {statusFeedback === 'acerto' ? 'Ponto! 🎉' : 'Incorreto! ✕'}
              </h2>
              <p className="text-white font-bold text-lg mb-8 uppercase tracking-wide text-center">
                Resposta: {desafios[indiceAtual]?.resposta}
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