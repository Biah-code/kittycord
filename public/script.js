document.addEventListener('DOMContentLoaded', () => {
    // Inicializa Socket.IO com fallback seguro caso abra sem servidor
    const socket = typeof io !== 'undefined'
        ? io()
        : {
            on: () => {},
            emit: (evento) => {
                if (evento === 'autenticar') {
                    alert('⚠️ Abra o chat pelo endereço http://localhost:3000 (com node server.js rodando) para conectar ao servidor!');
                }
            },
            disconnect: () => {},
            connect: () => {}
        };

    // ==========================================
    // PERSONAGENS HELLO KITTY & TURMA (AVATARES SVG)
    // ==========================================
    function gerarAvatarPersonagemSVG(tipo) {
        const svgs = {
            'Hello Kitty': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <rect width='100' height='100' rx='50' fill='#ffe4ec'/>
                <polygon points='22,42 26,16 46,32' fill='#ffffff' stroke='#3b232a' stroke-width='3'/>
                <polygon points='78,42 74,16 54,32' fill='#ffffff' stroke='#3b232a' stroke-width='3'/>
                <ellipse cx='50' cy='58' rx='34' ry='27' fill='#ffffff' stroke='#3b232a' stroke-width='3'/>
                <ellipse cx='36' cy='57' rx='3.2' ry='4.5' fill='#3b232a'/>
                <ellipse cx='64' cy='57' rx='3.2' ry='4.5' fill='#3b232a'/>
                <ellipse cx='50' cy='64' rx='4.5' ry='3' fill='#ffcf40' stroke='#3b232a' stroke-width='2'/>
                <line x1='12' y1='53' x2='24' y2='55' stroke='#3b232a' stroke-width='2.5' stroke-linecap='round'/>
                <line x1='10' y1='61' x2='23' y2='61' stroke='#3b232a' stroke-width='2.5' stroke-linecap='round'/>
                <line x1='88' y1='53' x2='76' y2='55' stroke='#3b232a' stroke-width='2.5' stroke-linecap='round'/>
                <line x1='90' y1='61' x2='77' y2='61' stroke='#3b232a' stroke-width='2.5' stroke-linecap='round'/>
                <ellipse cx='65' cy='31' rx='8' ry='6' fill='#ff2e63' stroke='#3b232a' stroke-width='2.5'/>
                <ellipse cx='79' cy='36' rx='8' ry='6' fill='#ff2e63' stroke='#3b232a' stroke-width='2.5'/>
                <circle cx='72' cy='33.5' r='4.5' fill='#ff2e63' stroke='#3b232a' stroke-width='2.5'/>
            </svg>`,

            'My Melody': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <rect width='100' height='100' rx='50' fill='#ffd6e7'/>
                <ellipse cx='35' cy='28' rx='10' ry='24' fill='#ff7aa8' stroke='#3b232a' stroke-width='3'/>
                <ellipse cx='65' cy='28' rx='10' ry='24' fill='#ff7aa8' stroke='#3b232a' stroke-width='3'/>
                <ellipse cx='50' cy='60' rx='33' ry='28' fill='#ff7aa8' stroke='#3b232a' stroke-width='3'/>
                <ellipse cx='50' cy='63' rx='24' ry='20' fill='#ffffff'/>
                <ellipse cx='39' cy='61' rx='3' ry='4.5' fill='#3b232a'/>
                <ellipse cx='61' cy='61' rx='3' ry='4.5' fill='#3b232a'/>
                <ellipse cx='50' cy='67' rx='3.5' ry='2.5' fill='#ffcf40'/>
                <circle cx='69' cy='43' r='7' fill='#ffffff' stroke='#3b232a' stroke-width='2'/>
                <circle cx='69' cy='43' r='2.5' fill='#ffcf40'/>
            </svg>`,

            'Kuromi': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <rect width='100' height='100' rx='50' fill='#efe3ff'/>
                <polygon points='20,44 16,12 42,34' fill='#2d2438' stroke='#1d1626' stroke-width='3'/>
                <polygon points='80,44 84,12 58,34' fill='#2d2438' stroke='#1d1626' stroke-width='3'/>
                <circle cx='16' cy='12' r='4' fill='#ff7aa8'/>
                <circle cx='84' cy='12' r='4' fill='#ff7aa8'/>
                <ellipse cx='50' cy='60' rx='33' ry='27' fill='#2d2438'/>
                <ellipse cx='50' cy='64' rx='24' ry='19' fill='#ffffff'/>
                <circle cx='50' cy='42' r='5.5' fill='#ff7aa8'/>
                <ellipse cx='39' cy='62' rx='3.2' ry='4.2' fill='#1d1626'/>
                <ellipse cx='61' cy='62' rx='3.2' ry='4.2' fill='#1d1626'/>
                <ellipse cx='50' cy='68' rx='3.5' ry='2.5' fill='#ff7aa8'/>
            </svg>`,

            'Cinnamoroll': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <rect width='100' height='100' rx='50' fill='#dff3ff'/>
                <ellipse cx='16' cy='60' rx='13' ry='22' transform='rotate(18 16 60)' fill='#ffffff' stroke='#5c8cb8' stroke-width='3'/>
                <ellipse cx='84' cy='60' rx='13' ry='22' transform='rotate(-18 84 60)' fill='#ffffff' stroke='#5c8cb8' stroke-width='3'/>
                <ellipse cx='50' cy='56' rx='30' ry='24' fill='#ffffff' stroke='#5c8cb8' stroke-width='3'/>
                <ellipse cx='37' cy='55' rx='3.5' ry='4.5' fill='#4798e8'/>
                <ellipse cx='63' cy='55' rx='3.5' ry='4.5' fill='#4798e8'/>
                <ellipse cx='31' cy='62' rx='5' ry='3' fill='#ffb3c6'/>
                <ellipse cx='69' cy='62' rx='5' ry='3' fill='#ffb3c6'/>
                <path d='M45,61 Q50,65 55,61' fill='none' stroke='#5c8cb8' stroke-width='2.5' stroke-linecap='round'/>
            </svg>`,

            'Pompompurin': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <rect width='100' height='100' rx='50' fill='#fff4cc'/>
                <ellipse cx='22' cy='56' rx='10' ry='20' transform='rotate(20 22 56)' fill='#ffe066' stroke='#6b4423' stroke-width='3'/>
                <ellipse cx='78' cy='56' rx='10' ry='20' transform='rotate(-20 78 56)' fill='#ffe066' stroke='#6b4423' stroke-width='3'/>
                <ellipse cx='50' cy='58' rx='31' ry='25' fill='#ffe066' stroke='#6b4423' stroke-width='3'/>
                <ellipse cx='50' cy='33' rx='16' ry='6' fill='#7a4928' stroke='#4a2b16' stroke-width='2.5'/>
                <circle cx='39' cy='56' r='3' fill='#4a2b16'/>
                <circle cx='61' cy='56' r='3' fill='#4a2b16'/>
                <ellipse cx='50' cy='61' rx='3' ry='2' fill='#4a2b16'/>
            </svg>`,

            'Charmmy Kitty': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <rect width='100' height='100' rx='50' fill='#fff0f5'/>
                <polygon points='22,42 25,14 45,32' fill='#ffffff' stroke='#7a4b58' stroke-width='3'/>
                <polygon points='78,42 75,14 55,32' fill='#ffffff' stroke='#7a4b58' stroke-width='3'/>
                <ellipse cx='50' cy='58' rx='34' ry='27' fill='#ffffff' stroke='#7a4b58' stroke-width='3'/>
                <ellipse cx='37' cy='57' rx='3' ry='4.5' fill='#3b232a'/>
                <ellipse cx='63' cy='57' rx='3' ry='4.5' fill='#3b232a'/>
                <ellipse cx='50' cy='64' rx='4' ry='2.8' fill='#ffb3c6'/>
                <ellipse cx='67' cy='31' rx='8' ry='6' fill='#ff85a2' stroke='#7a4b58' stroke-width='2'/>
                <circle cx='67' cy='31' r='3.5' fill='#fff'/>
            </svg>`
        };

        const escolhido = svgs[tipo] || svgs['Hello Kitty'];
        return `data:image/svg+xml;utf8,${encodeURIComponent(escolhido)}`;
    }

    const PERSONAGENS_LISTA = [
        { nome: 'Hello Kitty', desc: 'Gatinha branca do laço vermelho 🎀' },
        { nome: 'Charmmy Kitty', desc: 'Gatinha persa branca e fofa 🐾' },
        { nome: 'My Melody', desc: 'Coelhinha doce de capuz rosa 🌸' },
        { nome: 'Kuromi', desc: 'Estilosa com capuz roxo e caveirinha 💜' },
        { nome: 'Cinnamoroll', desc: 'Cachorrinho branco das nuvens ☁️' },
        { nome: 'Pompompurin', desc: 'Pudim fofinho de boina marrom 🍮' }
    ];

    const FRASES_GATINHOS_BRANCOS = [
        'Miau! Que tal uma xícara de leite morno e torta de maçã hoje? 🍎🥛',
        'Ronronando de felicidade com os amigos da casinha da Hello Kitty! 🐾🎀',
        'Um gatinho branco passando para desejar um dia cheio de laços e carinho! 🐱✨',
        'Você nunca tem amigos demais... nem laços vermelhos demais! 🎀💕',
        'Patinhas brancas na tela: hora de espalhar doçura no chat! 🐾🍓',
        'Miau-miau! Quem quer fazer um piquenique com biscoitos amanteigados? 🍪🌸',
        'Fofura máxima ativada no clube dos gatinhos brancos! 🐱☁️'
    ];

    const WALLPAPERS_LISTA = [
        { id: 'wp-lacos', nome: 'Laços da Kitty', desc: 'Rosa suave com lacinhos vermelhos', classe: 'wp-lacos' },
        { id: 'wp-gatinhos', nome: 'Gatinhos Brancos', desc: 'Patinhas e gatinhos brancos', classe: 'wp-gatinhos' },
        { id: 'wp-cinnamoroll', nome: 'Nuvens Azuis', desc: 'Céu pastel do Cinnamoroll', classe: 'wp-cinnamoroll' },
        { id: 'wp-kuromi', nome: 'Noite da Kuromi', desc: 'Lilás mágico com estrelinhas', classe: 'wp-kuromi' },
        { id: 'wp-morango', nome: 'Morangos Doces', desc: 'Creme com morangos e corações', classe: 'wp-morango' },
        { id: 'wp-poa', nome: 'Poá Clássico', desc: 'Bolinhas brancas sobre rosa pastel', classe: 'wp-poa' }
    ];

    // Helper seguro para pegar elementos sem quebrar o código
    const $ = (id) => document.getElementById(id);

    const authNomeInput = $('auth-nome');
    const authSenhaInput = $('auth-senha');
    const btnInlineEntrar = $('btn-inline-entrar');
    const btnInlineCadastrar = $('btn-inline-cadastrar');
    const areaLoginInline = $('area-login-inline');
    const areaPerfilLogado = $('area-perfil-logado');
    const textoPersonagemAtivo = $('texto-personagem-ativo');
    const btnLogout = $('btn-logout');

    const modalCriarSala = $('modal-criar-sala');
    const btnAbrirModalSala = $('btn-abrir-modal-sala');
    const railCriarGrupo = $('rail-criar-grupo');
    const btnFecharModalSala = $('btn-fechar-modal-sala');
    const btnCancelarSala = $('btn-cancelar-sala');
    const formCriarSala = $('form-criar-sala');
    const inputNomeSala = $('input-nome-sala');
    const salaErroEl = $('sala-erro');

    const modalPersonagem = $('modal-personagem');
    const gridPersonagens = $('grid-personagens');
    const btnAbrirPersonagem = $('btn-abrir-personagem');
    const btnFecharModalPersonagem = $('btn-fechar-modal-personagem');
    const btnConfirmarPersonagem = $('btn-confirmar-personagem');
    const btnUploadFotoCustom = $('btn-upload-foto-custom');
    const railAtalhoAvatar = $('rail-atalho-avatar');

    const modalWallpaper = $('modal-wallpaper');
    const gridWallpapers = $('grid-wallpapers');
    const btnAbrirWallpaper = $('btn-abrir-wallpaper');
    const btnFecharModalWallpaper = $('btn-fechar-modal-wallpaper');
    const btnFecharWallpaperOk = $('btn-fechar-wallpaper-ok');
    const railAtalhoWallpaper = $('rail-atalho-wallpaper');

    const formChat = $('form-chat');
    const nomeInput = $('nome');
    const dotMeuStatus = $('dot-meu-status');
    const mensagemInput = $('mensagem');
    const mensagens = $('mensagens');
    const listaCanais = $('lista-canais');
    const listaUsuarios = $('lista-usuarios');
    const railUsuarios = $('rail-usuarios');
    const btnRailGeral = document.querySelector('[data-atalho="Geral"]');
    const tituloConversa = $('titulo-conversa');
    const headerSimbolo = $('header-simbolo');
    const avatarConversa = $('avatar-conversa');
    const badgeTipoConversa = $('badge-tipo-conversa');
    const contadorMensagens = $('contador-mensagens');

    const fraseGatinhoAtualEl = $('frase-gatinho-atual');
    const btnUsarFrase = $('btn-usar-frase');
    const btnNovaFrase = $('btn-nova-frase');
    const btnFraseRapida = $('btn-frase-rapida');

    const inputPesquisa = $('input-pesquisa');
    const btnLimparPesquisa = $('btn-limpar-pesquisa');

    const btnAvatar = $('btn-avatar');
    const inputAvatar = $('input-avatar');
    const previewAvatar = $('preview-avatar');

    const btnEmoji = $('btn-emoji');
    const railAtalhoEmoji = $('rail-atalho-emoji');
    const emojiPicker = $('emoji-picker');
    const emojiGrid = $('emoji-grid');
    const buscaEmoji = $('busca-emoji');

    const btnImagem = $('btn-imagem');
    const inputImagem = $('input-imagem');
    const previewContainer = $('preview-container');
    const previewImg = $('preview-img');
    const btnCancelarImg = $('btn-cancelar-img');

    const btnGravarAudio = $('btn-gravar-audio');
    const gravacaoContainer = $('gravacao-container');
    const tempoGravacaoEl = $('tempo-gravacao');
    const btnCancelarAudio = $('btn-cancelar-audio');
    const btnEnviarAudio = $('btn-enviar-audio');

    let meuNome = '';
    let meuPersonagem = 'Hello Kitty';
    let meuAvatar = gerarAvatarPersonagemSVG('Hello Kitty');
    let wallpaperAtual = localStorage.getItem('kittycord_wallpaper') || 'wp-lacos';
    let imagemBase64 = null;
    let destinatarioAtual = 'Geral';
    let usuarioRegistrado = false;
    let termoPesquisa = '';
    let indiceFrase = 0;

    if (previewAvatar) previewAvatar.src = meuAvatar;

    let salasDisponiveis = [
        { id: 'Geral', nome: 'casinha-da-kitty', criador: 'Hello Kitty', isGrupo: false },
        { id: 'sala_gatinhos', nome: 'clube-gatinhos-brancos', criador: 'Hello Kitty', isGrupo: true },
        { id: 'sala_cha', nome: 'cha-e-torta-de-maça', criador: 'Mimmy', isGrupo: false }
    ];
    const salasVisitadasSessao = new Set(['Geral']);

    let mediaRecorder = null;
    let audioChunks = [];
    let streamAtual = null;
    let timerGravacao = null;
    let segundosGravados = 0;
    let cancelarEnvioAudio = false;

    const historicoConversas = { Geral: [], sala_gatinhos: [], sala_cha: [] };
    const naoLidas = {};
    const avataresUsuarios = {};

    // ==========================================
    // CONTROLE GLOBAL DE MODAIS E TECLA ESC
    // ==========================================
    function fecharTodosModais() {
        modalCriarSala?.classList.remove('ativo');
        modalPersonagem?.classList.remove('ativo');
        modalWallpaper?.classList.remove('ativo');
        if (salaErroEl) salaErroEl.textContent = '';
    }

    [modalCriarSala, modalPersonagem, modalWallpaper].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) fecharTodosModais();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharTodosModais();
            emojiPicker?.classList.remove('ativo');
        }
    });

    document.addEventListener('click', (e) => {
        if (!emojiPicker) return;
        const clicouNoEmoji = emojiPicker.contains(e.target) ||
            btnEmoji?.contains(e.target) ||
            railAtalhoEmoji?.contains(e.target);

        if (!clicouNoEmoji) {
            emojiPicker.classList.remove('ativo');
        }
    });

    // ==========================================
    // WALLPAPERS E PERSONAGENS
    // ==========================================
    function aplicarWallpaper(classeWp) {
        if (!mensagens) return;
        WALLPAPERS_LISTA.forEach(w => mensagens.classList.remove(w.classe));
        mensagens.classList.add(classeWp);
        wallpaperAtual = classeWp;
        localStorage.setItem('kittycord_wallpaper', classeWp);

        document.querySelectorAll('.wp-card').forEach(card => {
            card.classList.toggle('selecionado', card.dataset.wp === classeWp);
        });
    }
    aplicarWallpaper(wallpaperAtual);

    function renderizarSeletorPersonagens() {
        if (!gridPersonagens) return;
        gridPersonagens.innerHTML = '';
        PERSONAGENS_LISTA.forEach(p => {
            const card = document.createElement('div');
            card.className = `personagem-card ${meuPersonagem === p.nome ? 'selecionado' : ''}`;
            card.dataset.personagem = p.nome;
            card.innerHTML = `
                <img src="${gerarAvatarPersonagemSVG(p.nome)}" alt="${p.nome}">
                <strong>${p.nome}</strong>
                <span>${p.desc}</span>
            `;
            card.addEventListener('click', () => {
                meuPersonagem = p.nome;
                meuAvatar = gerarAvatarPersonagemSVG(p.nome);
                if (previewAvatar) previewAvatar.src = meuAvatar;

                document.querySelectorAll('.personagem-card').forEach(c => c.classList.remove('selecionado'));
                card.classList.add('selecionado');

                const statusLoginTexto = $('status-login');
                if (statusLoginTexto) {
                    statusLoginTexto.textContent = `Personagem: ${meuPersonagem} 🎀`;
                }

                if (usuarioRegistrado && meuNome) {
                    avataresUsuarios[meuNome] = meuAvatar;
                    if (textoPersonagemAtivo) textoPersonagemAtivo.textContent = `🎀 ${meuPersonagem} • Online`;
                    socket.emit('atualizar avatar', { avatar: meuAvatar, personagem: meuPersonagem });
                }
            });
            gridPersonagens.appendChild(card);
        });
    }
    renderizarSeletorPersonagens();

    function renderizarSeletorWallpapers() {
        if (!gridWallpapers) return;
        gridWallpapers.innerHTML = '';
        WALLPAPERS_LISTA.forEach(w => {
            const card = document.createElement('div');
            card.className = `wp-card ${wallpaperAtual === w.classe ? 'selecionado' : ''}`;
            card.dataset.wp = w.classe;
            card.innerHTML = `
                <div class="wp-preview ${w.classe}">🎀 🐱 🐾</div>
                <strong>${w.nome}</strong>
                <span>${w.desc}</span>
            `;
            card.addEventListener('click', () => aplicarWallpaper(w.classe));
            gridWallpapers.appendChild(card);
        });
    }
    renderizarSeletorWallpapers();

    function abrirModalPersonagem() {
        renderizarSeletorPersonagens();
        modalPersonagem?.classList.add('ativo');
    }

    function abrirModalWallpaper() {
        renderizarSeletorWallpapers();
        modalWallpaper?.classList.add('ativo');
    }

    btnAbrirPersonagem?.addEventListener('click', abrirModalPersonagem);
    btnAvatar?.addEventListener('click', abrirModalPersonagem);
    railAtalhoAvatar?.addEventListener('click', abrirModalPersonagem);
    btnFecharModalPersonagem?.addEventListener('click', () => modalPersonagem?.classList.remove('ativo'));
    btnConfirmarPersonagem?.addEventListener('click', () => modalPersonagem?.classList.remove('ativo'));

    btnUploadFotoCustom?.addEventListener('click', () => {
        modalPersonagem?.classList.remove('ativo');
        inputAvatar?.click();
    });

    btnAbrirWallpaper?.addEventListener('click', abrirModalWallpaper);
    railAtalhoWallpaper?.addEventListener('click', abrirModalWallpaper);
    btnFecharModalWallpaper?.addEventListener('click', () => modalWallpaper?.classList.remove('ativo'));
    btnFecharWallpaperOk?.addEventListener('click', () => modalWallpaper?.classList.remove('ativo'));

    // ==========================================
    // FRASES TEMÁTICAS DE GATINHOS BRANCOS
    // ==========================================
    btnNovaFrase?.addEventListener('click', () => {
        indiceFrase = (indiceFrase + 1) % FRASES_GATINHOS_BRANCOS.length;
        if (fraseGatinhoAtualEl) {
            fraseGatinhoAtualEl.textContent = `"${FRASES_GATINHOS_BRANCOS[indiceFrase]}"`;
        }
    });

    btnUsarFrase?.addEventListener('click', () => {
        const frase = FRASES_GATINHOS_BRANCOS[indiceFrase];
        if (!usuarioRegistrado) {
            if (mensagemInput) mensagemInput.value = frase;
            alert('🎀 Faça login no cantinho esquerdo para enviar a frase!');
            authNomeInput?.focus();
            return;
        }
        socket.emit('chat message', {
            nome: meuNome,
            personagem: meuPersonagem,
            avatar: meuAvatar,
            para: destinatarioAtual,
            mensagem: frase,
            imagem: null,
            audio: null,
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
    });

    btnFraseRapida?.addEventListener('click', () => {
        const aleatoria = FRASES_GATINHOS_BRANCOS[Math.floor(Math.random() * FRASES_GATINHOS_BRANCOS.length)];
        if (mensagemInput) {
            mensagemInput.value = (mensagemInput.value ? mensagemInput.value + ' ' : '') + aleatoria;
            mensagemInput.focus();
        }
    });

    // ==========================================
    // 1. AUTENTICAÇÃO DE USUÁRIOS (INLINE)
    // ==========================================
    function enviarAuthInline(modo) {
        const nome = authNomeInput?.value.trim() || '';
        const senha = authSenhaInput?.value.trim() || '';

        if (!nome || !senha) {
            alert('🎀 Preencha seu apelido fofo e senha no canto inferior esquerdo!');
            if (!nome) authNomeInput?.focus();
            else authSenhaInput?.focus();
            return;
        }

        socket.emit('autenticar', {
            modo,
            nome,
            senha,
            avatar: meuAvatar,
            personagem: meuPersonagem
        });
    }

    btnInlineEntrar?.addEventListener('click', () => enviarAuthInline('login'));
    btnInlineCadastrar?.addEventListener('click', () => enviarAuthInline('cadastro'));

    authNomeInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            authSenhaInput?.focus();
        }
    });

    authSenhaInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            enviarAuthInline('login');
        }
    });

    socket.on('auth erro', (mensagemErro) => {
        alert(mensagemErro);
    });

    socket.on('auth sucesso', ({ nome, avatar, personagem, salas }) => {
        meuNome = nome;
        usuarioRegistrado = true;
        meuPersonagem = personagem || meuPersonagem;

        if (avatar) {
            meuAvatar = avatar;
            if (previewAvatar) previewAvatar.src = avatar;
            avataresUsuarios[meuNome] = avatar;
        } else {
            meuAvatar = gerarAvatarPersonagemSVG(meuPersonagem);
            if (previewAvatar) previewAvatar.src = meuAvatar;
        }

        if (nomeInput) nomeInput.value = meuNome;
        if (textoPersonagemAtivo) textoPersonagemAtivo.textContent = `🎀 ${meuPersonagem} • Online`;
        dotMeuStatus?.classList.add('online');
        if (areaLoginInline) areaLoginInline.style.display = 'none';
        if (areaPerfilLogado) areaPerfilLogado.style.display = 'flex';
        if (btnLogout) btnLogout.style.display = 'inline-flex';
        if (mensagemInput) mensagemInput.placeholder = 'Miar em #casinha-da-kitty... 🐾';

        if (salas && Array.isArray(salas)) {
            salasDisponiveis = salas;
            renderizarListaSalas();
        }

        mensagemInput?.focus();
    });

    btnLogout?.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            cancelarEnvioAudio = true;
            mediaRecorder.stop();
        }

        meuNome = '';
        usuarioRegistrado = false;
        destinatarioAtual = 'Geral';
        if (authNomeInput) authNomeInput.value = '';
        if (authSenhaInput) authSenhaInput.value = '';
        dotMeuStatus?.classList.remove('online');
        if (areaPerfilLogado) areaPerfilLogado.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'none';
        if (areaLoginInline) areaLoginInline.style.display = 'flex';
        if (mensagemInput) mensagemInput.placeholder = 'Faça login no cantinho esquerdo para miar no chat... 🐾';

        socket.disconnect();
        socket.connect();
    });

    // ==========================================
    // 2. MÚLTIPLAS SALAS E CRIAÇÃO DE CLUBINHOS
    // ==========================================
    function abrirModalCriarSala() {
        if (!usuarioRegistrado) {
            alert('🎀 Faça login no canto inferior esquerdo antes de criar um clubinho!');
            authNomeInput?.focus();
            return;
        }
        if (salaErroEl) salaErroEl.textContent = '';
        if (inputNomeSala) inputNomeSala.value = '';
        modalCriarSala?.classList.add('ativo');
        inputNomeSala?.focus();
    }

    function fecharModalCriarSala() {
        modalCriarSala?.classList.remove('ativo');
        if (salaErroEl) salaErroEl.textContent = '';
    }

    btnAbrirModalSala?.addEventListener('click', abrirModalCriarSala);
    railCriarGrupo?.addEventListener('click', abrirModalCriarSala);
    btnFecharModalSala?.addEventListener('click', fecharModalCriarSala);
    btnCancelarSala?.addEventListener('click', fecharModalCriarSala);

    formCriarSala?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (salaErroEl) salaErroEl.textContent = '';

        const nomeSala = inputNomeSala?.value.trim() || '';
        const tipoRadio = document.querySelector('input[name="tipo-sala"]:checked');
        const tipoSelecionado = tipoRadio ? tipoRadio.value : 'grupo';

        if (!nomeSala) {
            if (salaErroEl) salaErroEl.textContent = '🐾 Informe o nome do cantinho.';
            return;
        }

        socket.emit('criar sala', {
            nomeSala,
            isGrupo: tipoSelecionado === 'grupo'
        });
    });

    socket.on('sala erro', (msg) => {
        if (salaErroEl) salaErroEl.textContent = msg;
    });

    socket.on('sala criada', (novaSala) => {
        fecharModalCriarSala();
        salasVisitadasSessao.add(novaSala.id);
        selecionarConversa(novaSala.id);
    });

    socket.on('lista salas', (salas) => {
        salasDisponiveis = salas;
        renderizarListaSalas();
    });

    function renderizarListaSalas() {
        if (!listaCanais) return;
        listaCanais.innerHTML = '';

        salasDisponiveis.forEach((sala) => {
            if (!historicoConversas[sala.id]) {
                historicoConversas[sala.id] = [];
            }

            const li = document.createElement('li');
            li.className = `usuario-item ${destinatarioAtual === sala.id ? 'ativo' : ''}`;
            li.dataset.usuario = sala.id;

            const icone = sala.isGrupo ? '🐾' : '🎀';
            const classeIcone = sala.isGrupo ? 'grupo-icone' : 'hash';

            li.innerHTML = `
                <span class="${classeIcone}">${icone}</span>
                <span class="nome-lista">${sala.nome}</span>
                ${naoLidas[sala.id] ? `<span class="badge-nova">${naoLidas[sala.id]}</span>` : ''}
            `;

            listaCanais.appendChild(li);
        });
    }
    renderizarListaSalas();

    // ==========================================
    // AVATAR CUSTOMIZADO, PESQUISA E EMOJIS
    // ==========================================
    function obterAvatar(nome, avatarCustomizado) {
        if (avatarCustomizado) return avatarCustomizado;
        if (avataresUsuarios[nome]) return avataresUsuarios[nome];
        return gerarAvatarPersonagemSVG('Hello Kitty');
    }

    inputAvatar?.addEventListener('change', event => {
        const arquivo = event.target.files[0];
        if (!arquivo) return;

        const leitor = new FileReader();
        leitor.onload = e => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const tamanho = 100;
                canvas.width = tamanho;
                canvas.height = tamanho;
                const ctx = canvas.getContext('2d');

                const min = Math.min(img.width, img.height);
                const sx = (img.width - min) / 2;
                const sy = (img.height - min) / 2;

                ctx.drawImage(img, sx, sy, min, min, 0, 0, tamanho, tamanho);
                meuAvatar = canvas.toDataURL('image/jpeg', 0.85);
                meuPersonagem = 'Gatinho Especial';
                if (previewAvatar) previewAvatar.src = meuAvatar;

                document.querySelectorAll('.personagem-card').forEach(c => c.classList.remove('selecionado'));

                if (usuarioRegistrado && meuNome) {
                    avataresUsuarios[meuNome] = meuAvatar;
                    if (textoPersonagemAtivo) textoPersonagemAtivo.textContent = `🎀 ${meuPersonagem} • Online`;
                    socket.emit('atualizar avatar', { avatar: meuAvatar, personagem: meuPersonagem });
                }
            };
            img.src = e.target.result;
        };
        leitor.readAsDataURL(arquivo);
        inputAvatar.value = '';
    });

    inputPesquisa?.addEventListener('input', () => {
        termoPesquisa = inputPesquisa.value.trim().toLowerCase();
        if (btnLimparPesquisa) btnLimparPesquisa.style.display = termoPesquisa ? 'inline-block' : 'none';
        aplicarFiltroPesquisa();
    });

    btnLimparPesquisa?.addEventListener('click', () => {
        if (inputPesquisa) inputPesquisa.value = '';
        termoPesquisa = '';
        if (btnLimparPesquisa) btnLimparPesquisa.style.display = 'none';
        aplicarFiltroPesquisa();
    });

    function aplicarFiltroPesquisa() {
        document.querySelectorAll('#lista-canais .usuario-item').forEach(item => {
            const nomeSala = item.textContent.toLowerCase();
            item.style.display = nomeSala.includes(termoPesquisa) ? 'flex' : 'none';
        });

        document.querySelectorAll('#lista-usuarios .usuario-item').forEach(item => {
            const nomeUsuario = (item.dataset.usuario || '').toLowerCase();
            item.style.display = nomeUsuario.includes(termoPesquisa) ? 'flex' : 'none';
        });

        if (!mensagens) return;
        mensagens.innerHTML = '';
        const lista = historicoConversas[destinatarioAtual] || [];
        let visiveis = 0;

        lista.forEach(dados => {
            const textoMatch = (dados.mensagem || '').toLowerCase().includes(termoPesquisa);
            const autorMatch = (dados.nome || '').toLowerCase().includes(termoPesquisa);
            const audioMatch = dados.audio && 'audio áudio'.includes(termoPesquisa);

            if (!termoPesquisa || textoMatch || autorMatch || audioMatch) {
                renderizarMensagemNaTela(dados);
                visiveis++;
            }
        });

        if (contadorMensagens) {
            contadorMensagens.textContent = `${visiveis} ${visiveis === 1 ? 'miado' : 'miados'}`;
        }
    }

    // Gaveta de Emojis
    const emojis = [
        { char: '🎀', nome: 'laco hello kitty' }, { char: '🐱', nome: 'gato gatinho' },
        { char: '🐾', nome: 'patinhas gato' }, { char: '🐈', nome: 'gatinho branco' },
        { char: '🍓', nome: 'morango doce' }, { char: '🍎', nome: 'maça torta' },
        { char: '🥛', nome: 'leite morno' }, { char: '🍰', nome: 'bolo doce' },
        { char: '🧁', nome: 'cupcake' }, { char: '🍪', nome: 'biscoito' },
        { char: '🌸', nome: 'flor sakura' }, { char: '🌷', nome: 'tulipa' },
        { char: '💖', nome: 'coracao brilho' }, { char: '💕', nome: 'dois coracoes' },
        { char: '🩷', nome: 'coracao rosa' }, { char: '✨', nome: 'estrelinhas brilho' },
        { char: '☁️', nome: 'nuvem cinnamoroll' }, { char: '🐰', nome: 'coelho my melody' },
        { char: '🍮', nome: 'pudim pompompurin' }, { char: '💜', nome: 'coracao roxo kuromi' },
        { char: '😊', nome: 'sorriso fofo' }, { char: '🥰', nome: 'apaixonado' },
        { char: '😍', nome: 'olhos coracao' }, { char: '🥳', nome: 'festa' },
        { char: '😴', nome: 'soneca gato' }, { char: '🌈', nome: 'arco iris' },
        { char: '🎈', nome: 'balao' }, { char: '🎁', nome: 'presente' }
    ];

    function renderizarEmojis(filtro = '') {
        if (!emojiGrid) return;
        emojiGrid.innerHTML = '';
        emojis
            .filter(e => !filtro || e.nome.includes(filtro.toLowerCase()))
            .forEach(item => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'emoji-item';
                btn.textContent = item.char;
                btn.title = item.nome;
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (mensagemInput) {
                        mensagemInput.value += item.char;
                        mensagemInput.focus();
                    }
                });
                emojiGrid.appendChild(btn);
            });
    }
    renderizarEmojis();

    buscaEmoji?.addEventListener('input', () => renderizarEmojis(buscaEmoji.value));
    btnEmoji?.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPicker?.classList.toggle('ativo');
    });
    railAtalhoEmoji?.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPicker?.classList.toggle('ativo');
    });

    // Anexo de imagens
    btnImagem?.addEventListener('click', () => inputImagem?.click());

    inputImagem?.addEventListener('change', event => {
        const arquivo = event.target.files[0];
        if (!arquivo) return;

        if (arquivo.size > 4 * 1024 * 1024) {
            alert('🎀 A imagem deve ter no máximo 4MB.');
            inputImagem.value = '';
            return;
        }

        const leitor = new FileReader();
        leitor.onload = () => {
            imagemBase64 = leitor.result;
            if (previewImg) previewImg.src = imagemBase64;
            previewContainer?.classList.add('ativo');
            mensagemInput?.focus();
        };
        leitor.readAsDataURL(arquivo);
    });

    function limparImagem() {
        imagemBase64 = null;
        if (inputImagem) inputImagem.value = '';
        if (previewImg) previewImg.src = '';
        previewContainer?.classList.remove('ativo');
    }

    btnCancelarImg?.addEventListener('click', limparImagem);

    // ==========================================
    // GRAVAÇÃO DE ÁUDIO
    // ==========================================
    function formatarTempo(segundos) {
        const min = String(Math.floor(segundos / 60)).padStart(2, '0');
        const seg = String(segundos % 60).padStart(2, '0');
        return `${min}:${seg}`;
    }

    function encerrarStreamAudio() {
        clearInterval(timerGravacao);
        timerGravacao = null;
        segundosGravados = 0;
        if (tempoGravacaoEl) tempoGravacaoEl.textContent = '00:00';
        gravacaoContainer?.classList.remove('ativo');
        btnGravarAudio?.classList.remove('gravando');

        if (streamAtual) {
            streamAtual.getTracks().forEach(track => track.stop());
            streamAtual = null;
        }
    }

    btnGravarAudio?.addEventListener('click', async () => {
        if (!usuarioRegistrado) {
            alert('🎀 Faça login no canto inferior esquerdo antes de gravar áudio!');
            authNomeInput?.focus();
            return;
        }

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            cancelarEnvioAudio = false;
            mediaRecorder.stop();
            return;
        }

        try {
            streamAtual = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunks = [];
            cancelarEnvioAudio = false;

            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');

            mediaRecorder = mimeType ? new MediaRecorder(streamAtual, { mimeType }) : new MediaRecorder(streamAtual);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                if (!cancelarEnvioAudio && audioChunks.length > 0) {
                    const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
                    const leitor = new FileReader();
                    leitor.onloadend = () => {
                        socket.emit('chat message', {
                            nome: meuNome,
                            personagem: meuPersonagem,
                            avatar: meuAvatar,
                            para: destinatarioAtual,
                            mensagem: '',
                            imagem: null,
                            audio: leitor.result,
                            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                        });
                    };
                    leitor.readAsDataURL(audioBlob);
                }
                encerrarStreamAudio();
            };

            mediaRecorder.start();
            gravacaoContainer?.classList.add('ativo');
            btnGravarAudio?.classList.add('gravando');

            segundosGravados = 0;
            if (tempoGravacaoEl) tempoGravacaoEl.textContent = '00:00';
            timerGravacao = setInterval(() => {
                segundosGravados++;
                if (tempoGravacaoEl) tempoGravacaoEl.textContent = formatarTempo(segundosGravados);
                if (segundosGravados >= 120 && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }, 1000);

        } catch (erro) {
            alert('🐾 Não foi possível acessar o microfone. Verifique as permissões do navegador.');
            encerrarStreamAudio();
        }
    });

    btnEnviarAudio?.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            cancelarEnvioAudio = false;
            mediaRecorder.stop();
        }
    });

    btnCancelarAudio?.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            cancelarEnvioAudio = true;
            mediaRecorder.stop();
        } else {
            encerrarStreamAudio();
        }
    });

    // ==========================================
    // HISTÓRICO E NAVEGAÇÃO ENTRE SALAS/GRUPOS/DMS
    // ==========================================
    socket.on('historico mensagens', (listaHistorico) => {
        Object.keys(historicoConversas).forEach(chave => {
            historicoConversas[chave] = [];
        });
        historicoConversas['Geral'] = [];

        const idsSalas = new Set(salasDisponiveis.map(s => s.id));

        listaHistorico.forEach(dados => {
            let chaveConversa;
            if (idsSalas.has(dados.para)) {
                chaveConversa = dados.para;
            } else {
                chaveConversa = dados.nome === meuNome ? dados.para : dados.nome;
            }

            if (!historicoConversas[chaveConversa]) {
                historicoConversas[chaveConversa] = [];
            }
            historicoConversas[chaveConversa].push(dados);
        });

        aplicarFiltroPesquisa();
    });

    function selecionarConversa(alvo) {
        destinatarioAtual = alvo;
        naoLidas[alvo] = 0;

        const salaEncontrada = salasDisponiveis.find(s => s.id === alvo);

        if (salaEncontrada) {
            if (headerSimbolo) {
                headerSimbolo.style.display = 'inline';
                headerSimbolo.textContent = salaEncontrada.isGrupo ? '🐾' : '🎀';
            }
            if (avatarConversa) avatarConversa.style.display = 'none';
            if (tituloConversa) tituloConversa.textContent = salaEncontrada.nome;
            if (mensagemInput) mensagemInput.placeholder = `Miar em #${salaEncontrada.nome}... 🐾`;

            if (badgeTipoConversa) {
                if (salaEncontrada.isGrupo) {
                    badgeTipoConversa.textContent = `Clubinho • por ${salaEncontrada.criador}`;
                    badgeTipoConversa.style.display = 'inline-block';
                } else {
                    badgeTipoConversa.style.display = 'none';
                }
            }

            if (!salasVisitadasSessao.has(alvo)) {
                salasVisitadasSessao.add(alvo);
                socket.emit('entrar sala', { salaId: alvo });
            }
        } else {
            if (headerSimbolo) headerSimbolo.style.display = 'none';
            if (badgeTipoConversa) badgeTipoConversa.style.display = 'none';
            if (avatarConversa) {
                avatarConversa.src = obterAvatar(alvo);
                avatarConversa.style.display = 'block';
            }
            if (tituloConversa) tituloConversa.textContent = alvo;
            if (mensagemInput) mensagemInput.placeholder = `Conversar com @${alvo} 🎀`;
        }

        document.querySelectorAll('.usuario-item').forEach(li => {
            li.classList.toggle('ativo', li.dataset.usuario === alvo);
            if (li.dataset.usuario === alvo) {
                li.querySelector('.badge-nova')?.remove();
            }
        });

        btnRailGeral?.classList.toggle('ativo', alvo === 'Geral');
        document.querySelectorAll('.rail-user-btn').forEach(btn => {
            btn.classList.toggle('ativo', btn.dataset.usuario === alvo);
            if (btn.dataset.usuario === alvo) {
                btn.querySelector('.rail-badge')?.remove();
            }
        });

        aplicarFiltroPesquisa();
    }

    function abrirConversaComVerificacao(alvo) {
        if (!usuarioRegistrado) {
            alert('🎀 Faça login no canto inferior esquerdo antes de entrar nos cantinhos!');
            authNomeInput?.focus();
            return;
        }
        selecionarConversa(alvo);
    }

    function lidarCliqueSidebar(event) {
        const item = event.target.closest('.usuario-item');
        if (!item) return;
        abrirConversaComVerificacao(item.dataset.usuario);
    }

    listaCanais?.addEventListener('click', lidarCliqueSidebar);
    listaUsuarios?.addEventListener('click', lidarCliqueSidebar);

    btnRailGeral?.addEventListener('click', () => abrirConversaComVerificacao('Geral'));
    railUsuarios?.addEventListener('click', event => {
        const btn = event.target.closest('.rail-user-btn');
        if (!btn) return;
        abrirConversaComVerificacao(btn.dataset.usuario);
    });

    socket.on('lista usuarios', usuarios => {
        const mapaUsuarios = new Map();

        usuarios.forEach(u => {
            const nome = typeof u === 'string' ? u : u.nome;
            const avatar = typeof u === 'object' ? u.avatar : null;
            const personagem = typeof u === 'object' ? u.personagem : 'Hello Kitty';
            if (avatar) avataresUsuarios[nome] = avatar;
            mapaUsuarios.set(nome, { avatar: avatar || avataresUsuarios[nome], personagem });
        });

        renderizarListaSalas();

        if (!listaUsuarios || !railUsuarios) return;
        listaUsuarios.innerHTML = '';
        railUsuarios.innerHTML = '';

        mapaUsuarios.forEach((info, usuario) => {
            if (usuario === meuNome) return;

            const imgSrc = obterAvatar(usuario, info.avatar);

            const li = document.createElement('li');
            li.className = `usuario-item ${destinatarioAtual === usuario ? 'ativo' : ''}`;
            li.dataset.usuario = usuario;

            li.innerHTML = `
                <div class="avatar-wrapper">
                    <img src="${imgSrc}" class="avatar-lista" alt="${usuario}">
                    <span class="status-dot-online"></span>
                </div>
                <span class="nome-lista">${usuario} <small style="opacity:0.75;">(${info.personagem})</small></span>
            `;

            if (naoLidas[usuario]) {
                li.innerHTML += `<span class="badge-nova">${naoLidas[usuario]}</span>`;
            }
            listaUsuarios.appendChild(li);

            const railBtn = document.createElement('div');
            railBtn.className = `rail-item rail-user-btn ${destinatarioAtual === usuario ? 'ativo' : ''}`;
            railBtn.dataset.usuario = usuario;
            railBtn.title = `${usuario} (${info.personagem})`;
            railBtn.innerHTML = `
                <img src="${imgSrc}" class="rail-avatar-img" alt="${usuario}">
                <span class="rail-online-dot"></span>
                ${naoLidas[usuario] ? `<span class="rail-badge">${naoLidas[usuario]}</span>` : ''}
            `;
            railUsuarios.appendChild(railBtn);
        });

        aplicarFiltroPesquisa();
    });

    formChat?.addEventListener('submit', event => {
        event.preventDefault();

        if (!usuarioRegistrado) {
            alert('🎀 Faça login no canto inferior esquerdo antes de enviar mensagens!');
            authNomeInput?.focus();
            return;
        }

        const mensagem = mensagemInput?.value.trim() || '';

        if (mensagem || imagemBase64) {
            socket.emit('chat message', {
                nome: meuNome,
                personagem: meuPersonagem,
                avatar: meuAvatar,
                para: destinatarioAtual,
                mensagem,
                imagem: imagemBase64,
                audio: null,
                hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            });

            if (mensagemInput) mensagemInput.value = '';
            emojiPicker?.classList.remove('ativo');
            limparImagem();
            mensagemInput?.focus();
        }
    });

    function renderizarMensagemNaTela(dados) {
        if (!mensagens) return;

        if (dados.sistema) {
            const liSys = document.createElement('li');
            liSys.className = 'system-msg-row';
            liSys.innerHTML = `
                <span class="system-msg-icon">🎀</span>
                <span class="system-msg-text">${dados.mensagem}</span>
                <span class="system-msg-time">${dados.hora || ''}</span>
            `;
            mensagens.appendChild(liSys);
            mensagens.scrollTop = mensagens.scrollHeight;
            return;
        }

        if (dados.avatar) {
            avataresUsuarios[dados.nome] = dados.avatar;
        }

        const li = document.createElement('li');
        li.className = 'discord-msg-row';

        const avatarImg = document.createElement('img');
        avatarImg.src = obterAvatar(dados.nome, dados.avatar);
        avatarImg.className = 'discord-msg-avatar';
        avatarImg.alt = dados.nome;

        const conteudo = document.createElement('div');
        conteudo.className = 'discord-msg-content';

        const cabecalho = document.createElement('div');
        cabecalho.className = 'discord-msg-header';

        const autorSpan = document.createElement('span');
        autorSpan.className = 'discord-msg-author';
        if (dados.nome === meuNome) autorSpan.classList.add('meu-autor');
        autorSpan.textContent = dados.nome;

        const tagPersonagem = document.createElement('span');
        tagPersonagem.className = 'tag-personagem-msg';
        tagPersonagem.textContent = `🎀 ${dados.personagem || 'Hello Kitty'}`;

        const horaSpan = document.createElement('span');
        horaSpan.className = 'discord-msg-time';
        const prefixoData = dados.dataCompleta ? `${dados.dataCompleta} às` : 'Hoje às';
        horaSpan.textContent = `${prefixoData} ${dados.hora}`;

        cabecalho.appendChild(autorSpan);
        cabecalho.appendChild(tagPersonagem);
        cabecalho.appendChild(horaSpan);
        conteudo.appendChild(cabecalho);

        if (dados.mensagem) {
            const textoP = document.createElement('p');
            textoP.className = 'discord-msg-text';
            textoP.textContent = dados.mensagem;
            conteudo.appendChild(textoP);
        }

        if (dados.imagem) {
            const img = document.createElement('img');
            img.src = dados.imagem;
            img.className = 'imagem-enviada';
            img.alt = 'Imagem enviada';
            img.addEventListener('click', () => {
                const novaAba = window.open();
                novaAba.document.write(`<img src="${dados.imagem}" style="max-width:100%;">`);
            });
            conteudo.appendChild(img);
        }

        if (dados.audio) {
            const audioEl = document.createElement('audio');
            audioEl.src = dados.audio;
            audioEl.controls = true;
            audioEl.className = 'audio-enviado';
            conteudo.appendChild(audioEl);
        }

        li.appendChild(avatarImg);
        li.appendChild(conteudo);

        mensagens.appendChild(li);
        mensagens.scrollTop = mensagens.scrollHeight;
    }

    socket.on('chat message', dados => {
        const idsSalas = new Set(salasDisponiveis.map(s => s.id));
        let chaveConversa;

        if (idsSalas.has(dados.para)) {
            chaveConversa = dados.para;
        } else {
            chaveConversa = dados.nome === meuNome ? dados.para : dados.nome;
        }

        if (!historicoConversas[chaveConversa]) {
            historicoConversas[chaveConversa] = [];
        }
        historicoConversas[chaveConversa].push(dados);

        if (destinatarioAtual === chaveConversa) {
            aplicarFiltroPesquisa();
        } else {
            naoLidas[chaveConversa] = (naoLidas[chaveConversa] || 0) + 1;

            const itemSidebar = document.querySelector(`.usuario-item[data-usuario="${chaveConversa}"]`);
            if (itemSidebar) {
                let badge = itemSidebar.querySelector('.badge-nova');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'badge-nova';
                    itemSidebar.appendChild(badge);
                }
                badge.textContent = naoLidas[chaveConversa];
            }

            const railBtn = document.querySelector(`.rail-user-btn[data-usuario="${chaveConversa}"]`);
            if (railBtn) {
                let rBadge = railBtn.querySelector('.rail-badge');
                if (!rBadge) {
                    rBadge = document.createElement('span');
                    rBadge.className = 'rail-badge';
                    railBtn.appendChild(rBadge);
                }
                rBadge.textContent = naoLidas[chaveConversa];
            }
        }
    })
    })
