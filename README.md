# Super Bee (Clone) & Trilha Senac Jovens Aprendizes

Plataforma interativa desenvolvida para simular a dinâmica de uma competição de Spelling Bee (Soletração) em inglês, baseada na experiência utilizada pelo Senac / Fecomércio-RS. O sistema permite praticar a escuta (Text-to-Speech) e a digitação correta de vocabulários com feedback visual imediato, efeitos sonoros nativos e gerenciamento completo de palavras.

---

## Tecnologias Utilizadas

O projeto foi construído utilizando um ecossistema moderno focado em performance, sem dependências pesadas de terceiros:

* Next.js (App Router): Estruturação de rotas de página (page.js) e layouts dinâmicos.
* React (Hooks & Refs): Gerenciamento reativo de estados (useState), ciclo de vida (useEffect) e foco dinâmico/trava de teclado (useRef).
* Tailwind CSS: Estilização responsiva direta no JSX, transições suaves de cores de fundo e efeitos de desfoque (blur).
* Web Speech API: Funcionalidade nativa do navegador (window.speechSynthesis) para leitura das palavras em voz alta com sotaque americano (en-US).
* Web Audio API (AudioContext): Geração de efeitos sonoros sintéticos (SFX) para acertos e erros gerados por frequências de áudio via código, eliminando a necessidade de arquivos .mp3 externos.

---

## Funcionalidades Principais

### 1. Tela Inicial Dinâmica

* Seletor Deslizante de Modo: Altera instantaneamente a identidade visual e o contexto do app entre Super Bee (Tema Laranja Vibrante) e Jovens Aprendizes (Tema Azul Corporativo do Senac).
* Padrão de Texto Flutuante: Fundo decorado com palavras transparentes flutuantes em baixa opacidade que conversam com o design das telas de jogo.
* Validação de Entrada: Caixa de texto para o nome do competidor com tratamento visual de erro direto na interface (borda vermelha e aviso animado), sem alertas do sistema.
* Hall da Fama (Placar): Ranking integrado com o Top 5 das melhores pontuações locais baseadas em maior número de acertos e menor número de erros.

### 2. Telas de Jogo (/jogo e /jovens)

* Feedback Visual e Bloqueante: Telas inteiras que mudam de cor instantaneamente no acerto (Verde) ou erro (Vermelho), com uma trava de segurança temporária para evitar pulos acidentais ao pressionar Enter.
* Cronômetro: Contagem regressiva de 1 minuto que pausa automaticamente durante a exibição dos cards de feedback de acerto/erro.
* Palavra Oculta: O texto da palavra atual fica sob um efeito de desfoque rígido (blur-2xl), sendo revelado apenas ao clicar no botão de visualização.
* Controle de Áudio: Botão para repetir o áudio original e ajuste automatizado de velocidade (rate: 0.8) para fins educacionais.
* Lista Sanfona: Rodapé expansível de alto contraste que exibe o histórico de palavras respondidas (com símbolos de acerto e erro) e permite reouvir o áudio de qualquer item anterior.

### 3. Painel Geral Admin (CMS Local)

* Gerenciador de Vocabulário: Painel embutido para criar, excluir e ler palavras em tempo real.
* Segmentação Completa: Permite gerenciar as palavras de forma isolada filtrando por Modo (Super Bee/Jovens), Modalidade (Kids/Teens) e Etapa (Escolar/Final).
* Restauração Inteligente: Botão para resetar e carregar instantaneamente as listas de palavras sugeridas padrão a qualquer momento.

---

## Estrutura de Arquiteturas e Rotas

O roteamento da aplicação baseia-se na estrutura do Next.js App Router, mapeando pastas diretamente para URLs do navegador:

```plaintext
superbee-taquara/
 ├── public/
 │    ├── logo-superbee.png          # Logo do jogo no painel esquerdo
 │    └── logo-fecomercio-senac.png  # Logo oficial do Senac no rodapé
 └── src/
      └── app/
           ├── globals.css           # Estilos globais e injeção do Tailwind
           ├── layout.js             # Layout HTML base e Metadados da aba (Title)
           ├── page.js               # ROTA RAIZ (/): Menu Inicial, Placar e Admin
           ├── jogo/
           │    └── page.js          # ROTA (/jogo): Partida do Modo Super Bee (Laranja)
           └── jovens/
                └── page.js          # ROTA (/jovens): Partida de Jovens Aprendizes (Azul Senac)

```

---

## Persistência de Dados (localStorage)

Para garantir que o jogo funcione de forma autônoma sem a necessidade de configurar um banco de dados em nuvem ou API externa num primeiro momento, todas as informações são guardadas localmente no navegador:

* spelling_leaderboard: Array de objetos contendo os recordes de pontuação dos alunos (nome, acertos, erros, tipo e data).
* custom_words_superbee: Objeto de strings contendo as palavras personalizadas inseridas pelo administrador para as categorias do Super Bee.
* custom_words_jovens: Objeto de strings contendo as palavras personalizadas de vocabulário comercial/corporativo inseridas para os Jovens Aprendizes.

---

## Como Executar o Projeto

1. Clone ou baixe este repositório no seu ambiente (ex: GitHub Codespaces ou máquina local).
2. Certifique-se de ter o Node.js instalado.
3. Instale as dependências do projeto executando o comando no terminal:
```bash
npm install

```


4. Inicie o servidor de desenvolvimento:
```bash
npm run dev

```


5. Abra o navegador no endereço indicado (geralmente http://localhost:3000) para testar o aplicativo.