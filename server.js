const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const io = require('socket.io')(http, {
  maxHttpBufferSize: 15e6 // 15MB para suportar áudios e imagens
});

const DB_PATH = path.join(__dirname, 'db.json');

function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex');
}

function salasPadraoHelloKitty() {
  return [
    { id: 'Geral', nome: 'casinha-da-kitty', criador: 'Hello Kitty', isGrupo: false },
    { id: 'sala_gatinhos', nome: 'clube-gatinhos-brancos', criador: 'Hello Kitty', isGrupo: true },
    { id: 'sala_cha', nome: 'cha-e-torta-de-maca', criador: 'Mimmy', isGrupo: false }
  ];
}

// Carrega ou inicializa o arquivo db.json com suporte a salas/grupos temáticos
function carregarDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const inicial = {
        mensagens: [],
        usuarios: {},
        salas: salasPadraoHelloKitty()
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(inicial, null, 2), 'utf-8');
      return inicial;
    }
    const conteudo = fs.readFileSync(DB_PATH, 'utf-8');
    const db = JSON.parse(conteudo);
    if (!db.usuarios) db.usuarios = {};
    if (!db.mensagens) db.mensagens = [];
    if (!db.salas || !Array.isArray(db.salas) || db.salas.length === 0) {
      db.salas = salasPadraoHelloKitty();
    } else {
      // Atualiza o nome do canal Geral para o tema Hello Kitty se ainda estiver no padrão antigo
      const geral = db.salas.find(s => s.id === 'Geral');
      if (geral && geral.nome === 'general-chat') {
        geral.nome = 'casinha-da-kitty';
      }
    }
    return db;
  } catch (err) {
    console.error('Erro ao ler db.json:', err);
    return {
      mensagens: [],
      usuarios: {},
      salas: salasPadraoHelloKitty()
    };
  }
}

function salvarDB(db) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar db.json:', err);
  }
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const usuariosOnline = {};

io.on('connection', (socket) => {
  console.log('Nova patinha conectada:', socket.id);

  const dbInicial = carregarDB();
  socket.emit('lista salas', dbInicial.salas);
  socket.emit('lista usuarios', Object.values(usuariosOnline));

  // ==========================================
  // 1. AUTENTICAÇÃO (CADASTRO E LOGIN)
  // ==========================================
  socket.on('autenticar', ({ modo, nome, senha, avatar, personagem }) => {
    const nomeLimpo = (nome || '').trim();
    const senhaLimpa = (senha || '').trim();

    if (!nomeLimpo || !senhaLimpa) {
      return socket.emit('auth erro', '🎀 Preencha seu apelido fofo e senha!');
    }

    if (nomeLimpo.toLowerCase() === 'geral' || nomeLimpo.toLowerCase() === 'sistema') {
      return socket.emit('auth erro', '🐱 Este nome é reservado pela Hello Kitty.');
    }

    const db = carregarDB();
    const usuarioExistente = db.usuarios[nomeLimpo];

    if (modo === 'cadastro') {
      if (usuarioExistente && usuarioExistente.senhaHash) {
        return socket.emit('auth erro', '🎀 Esse apelido já existe! Clique em Entrar.');
      }
      db.usuarios[nomeLimpo] = {
        senhaHash: hashSenha(senhaLimpa),
        avatar: avatar || (usuarioExistente ? usuarioExistente.avatar : null),
        personagem: personagem || 'Hello Kitty'
      };
      salvarDB(db);
    } else {
      if (!usuarioExistente || !usuarioExistente.senhaHash) {
        return socket.emit('auth erro', '🐱 Gatinho não encontrado! Clique em Criar.');
      }
      if (usuarioExistente.senhaHash !== hashSenha(senhaLimpa)) {
        return socket.emit('auth erro', '🎀 Senha incorreta! Tente novamente.');
      }
      if (avatar) db.usuarios[nomeLimpo].avatar = avatar;
      if (personagem) db.usuarios[nomeLimpo].personagem = personagem;
      salvarDB(db);
    }

    const jaEstavaOnline = Object.values(usuariosOnline).some(u => u.nome === nomeLimpo);
    const avatarFinal = db.usuarios[nomeLimpo].avatar || null;
    const personagemFinal = db.usuarios[nomeLimpo].personagem || 'Hello Kitty';

    usuariosOnline[socket.id] = {
      nome: nomeLimpo,
      avatar: avatarFinal,
      personagem: personagemFinal
    };

    socket.join(nomeLimpo);
    db.salas.forEach((sala) => socket.join(`sala:${sala.id}`));

    socket.emit('auth sucesso', {
      nome: nomeLimpo,
      avatar: avatarFinal,
      personagem: personagemFinal,
      salas: db.salas
    });

    const idsSalas = new Set(db.salas.map(s => s.id));
    const historicoDoUsuario = db.mensagens.filter(
      (msg) => idsSalas.has(msg.para) || msg.para === nomeLimpo || msg.nome === nomeLimpo
    );
    socket.emit('historico mensagens', historicoDoUsuario);

    io.emit('lista usuarios', Object.values(usuariosOnline));

    if (!jaEstavaOnline) {
      const msgEntrada = {
        id: Date.now() + '-sys-' + Math.random().toString(36).substring(2, 6),
        sistema: true,
        nome: 'Sistema',
        para: 'Geral',
        mensagem: `🎀 Miau! ${nomeLimpo} (${personagemFinal}) chegou na casinha da Hello Kitty! 🐾`,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        dataCompleta: new Date().toLocaleDateString('pt-BR')
      };

      db.mensagens.push(msgEntrada);
      salvarDB(db);
      io.to('sala:Geral').emit('chat message', msgEntrada);
    }
  });

  // Atualização de personagem/avatar após logado
  socket.on('atualizar avatar', ({ avatar, personagem }) => {
    const user = usuariosOnline[socket.id];
    if (!user) return;

    const db = carregarDB();
    if (db.usuarios[user.nome]) {
      if (avatar) db.usuarios[user.nome].avatar = avatar;
      if (personagem) db.usuarios[user.nome].personagem = personagem;
      salvarDB(db);
    }
    if (avatar) user.avatar = avatar;
    if (personagem) user.personagem = personagem;
    io.emit('lista usuarios', Object.values(usuariosOnline));
  });

  // ==========================================
  // 2. MÚLTIPLAS SALAS / CRIAÇÃO DE GRUPOS
  // ==========================================
  socket.on('criar sala', ({ nomeSala, isGrupo }) => {
    const user = usuariosOnline[socket.id];
    if (!user) {
      return socket.emit('sala erro', '🎀 Faça login antes de criar um cantinho!');
    }

    const nomeFormatado = (nomeSala || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_à-ú]/g, '');

    if (!nomeFormatado) {
      return socket.emit('sala erro', '🐾 Digite um nome fofo para a sala.');
    }

    const db = carregarDB();
    const jaExiste = db.salas.some(
      (s) => s.nome.toLowerCase() === nomeFormatado || s.id.toLowerCase() === nomeFormatado
    );

    if (jaExiste) {
      return socket.emit('sala erro', '🎀 Já existe um cantinho com esse nome!');
    }

    const novaSala = {
      id: 'sala_' + Date.now(),
      nome: nomeFormatado,
      criador: user.nome,
      isGrupo: Boolean(isGrupo)
    };

    db.salas.push(novaSala);

    const msgCriacao = {
      id: Date.now() + '-sys-' + Math.random().toString(36).substring(2, 6),
      sistema: true,
      nome: 'Sistema',
      para: novaSala.id,
      mensagem: `🎀 ${user.nome} criou ${novaSala.isGrupo ? 'o clubinho' : 'a salinha'} #${novaSala.nome}!`,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      dataCompleta: new Date().toLocaleDateString('pt-BR')
    };
    db.mensagens.push(msgCriacao);
    salvarDB(db);

    io.socketsJoin(`sala:${novaSala.id}`);

    io.emit('lista salas', db.salas);
    io.to(`sala:${novaSala.id}`).emit('chat message', msgCriacao);
    socket.emit('sala criada', novaSala);
  });

  socket.on('entrar sala', ({ salaId }) => {
    const user = usuariosOnline[socket.id];
    if (!user || !salaId || salaId === 'Geral') return;

    const db = carregarDB();
    const sala = db.salas.find(s => s.id === salaId);
    if (!sala) return;

    socket.join(`sala:${salaId}`);

    const msgEntradaSala = {
      id: Date.now() + '-sys-' + Math.random().toString(36).substring(2, 6),
      sistema: true,
      nome: 'Sistema',
      para: salaId,
      mensagem: `🐾 ${user.nome} entrou ronronando em #${sala.nome}.`,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      dataCompleta: new Date().toLocaleDateString('pt-BR')
    };

    db.mensagens.push(msgEntradaSala);
    salvarDB(db);
    io.to(`sala:${salaId}`).emit('chat message', msgEntradaSala);
  });

  // ==========================================
  // ENVIO DE MENSAGENS
  // ==========================================
  socket.on('chat message', (data) => {
    const user = usuariosOnline[socket.id];
    if (!user) {
      return socket.emit('auth erro', '🎀 Entre com seu personagem antes de enviar mensagens!');
    }

    const db = carregarDB();
    const ehSalaOuGrupo = db.salas.some((s) => s.id === data.para);

    const novaMensagem = {
      id: Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      sistema: false,
      nome: user.nome,
      personagem: user.personagem || data.personagem || 'Hello Kitty',
      avatar: user.avatar || (db.usuarios[user.nome] ? db.usuarios[user.nome].avatar : null),
      para: data.para,
      mensagem: data.mensagem || '',
      imagem: data.imagem || null,
      audio: data.audio || null,
      hora: data.hora,
      dataCompleta: new Date().toLocaleDateString('pt-BR')
    };

    db.mensagens.push(novaMensagem);
    salvarDB(db);

    if (ehSalaOuGrupo) {
      io.to(`sala:${novaMensagem.para}`).emit('chat message', novaMensagem);
    } else {
      io.to(novaMensagem.para).to(novaMensagem.nome).emit('chat message', novaMensagem);
    }
  });

  socket.on('disconnect', () => {
    const user = usuariosOnline[socket.id];
    delete usuariosOnline[socket.id];

    if (user) {
      const aindaConectado = Object.values(usuariosOnline).some(u => u.nome === user.nome);
      if (!aindaConectado) {
        const db = carregarDB();
        const msgSaida = {
          id: Date.now() + '-sys-' + Math.random().toString(36).substring(2, 6),
          sistema: true,
          nome: 'Sistema',
          para: 'Geral',
          mensagem: `🌙 ${user.nome} foi tirar uma soneca de gatinho branco.`,
          hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          dataCompleta: new Date().toLocaleDateString('pt-BR')
        };
        db.mensagens.push(msgSaida);
        salvarDB(db);
        io.to('sala:Geral').emit('chat message', msgSaida);
      }
    }

    io.emit('lista usuarios', Object.values(usuariosOnline));
  });
});

http.listen(3000, () => {
  console.log('🎀 KittyCord rodando na porta 3000 - http://localhost:3000');
});