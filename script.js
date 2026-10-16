const CAMINHO_IMAGENS = "assets/otimizados";

const ESTADOS_URNA = {
  vazio: "base0",
  parcial: "base1",
  lula: "base13",
  bolsonaro: "base22",
  invalido: "baseE",
};

const app = {
  digitos: [],
  imagem: document.querySelector("#imagem-urna"),
  fonteImagem: document.querySelector("#fonte-imagem-urna"),
  digito1: document.querySelector("#digito-1"),
  digito2: document.querySelector("#digito-2"),
  somClique: document.querySelector("#som-clique"),
  somConfirma: document.querySelector("#som-confirma"),
  somErro: document.querySelector("#som-erro"),
};

function obterNomeDaImagem() {
  if (app.digitos.length === 0) {
    return ESTADOS_URNA.vazio;
  }

  if (app.digitos.length === 1) {
    return ESTADOS_URNA.parcial;
  }

  const voto = app.digitos.join("");

  if (voto === "13") {
    return ESTADOS_URNA.lula;
  }

  if (voto === "22") {
    return ESTADOS_URNA.bolsonaro;
  }

  return ESTADOS_URNA.invalido;
}

function atualizarImagem() {
  const nomeImagem = obterNomeDaImagem();
  const caminhoWebp = `${CAMINHO_IMAGENS}/${nomeImagem}.webp`;
  const caminhoPng = `assets/${nomeImagem}.png`;

  app.fonteImagem.srcset = caminhoWebp;
  app.imagem.src = caminhoPng;
}

function atualizarDigitos() {
  app.digito1.textContent = app.digitos[0] ?? "";
  app.digito2.textContent = app.digitos[1] ?? "";
}

function atualizarUrna() {
  atualizarImagem();
  atualizarDigitos();
}

function tocarSom(som) {
  if (!som) {
    return;
  }

  som.currentTime = 0;
  const reproducao = som.play();

  if (reproducao?.catch) {
    reproducao.catch(() => {
      // O navegador pode bloquear áudio somente quando a ação não veio de um toque.
    });
  }
}

function digitarNumero(numero) {
  if (app.digitos.length >= 2) {
    return;
  }

  app.digitos.push(String(numero));
  tocarSom(app.somClique);
  atualizarUrna();
}

function corrigirVoto() {
  app.digitos = [];
  tocarSom(app.somClique);
  atualizarUrna();
}

function confirmarVoto() {
  if (app.digitos.length < 2) {
    return;
  }

  const voto = app.digitos.join("");
  tocarSom(voto === "13" ? app.somConfirma : app.somErro);
}

function registrarEventos() {
  document.querySelectorAll("[data-digito]").forEach((tecla) => {
    tecla.addEventListener("click", () => digitarNumero(tecla.dataset.digito));
  });

  document.querySelector("#botao-corrige").addEventListener("click", corrigirVoto);
  document.querySelector("#botao-confirma").addEventListener("click", confirmarVoto);

  document.addEventListener("keydown", (evento) => {
    if (/^\d$/.test(evento.key)) {
      digitarNumero(evento.key);
    }

    if (evento.key === "Escape") {
      corrigirVoto();
    }

    if (evento.key === "Enter") {
      confirmarVoto();
    }
  });
}

function eCelular() {
  const telaPequena = window.matchMedia("(max-width: 900px)").matches;
  const toque = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  return telaPequena && toque;
}

function atualizarAvisoDeOrientacao() {
  const estaRetrato = window.matchMedia("(orientation: portrait)").matches;
  const deveAguardarRotacao = eCelular() && estaRetrato;
  const aviso = document.querySelector("#aviso-orientacao");

  document.body.classList.toggle("mostrar-orientacao", deveAguardarRotacao);
  aviso.setAttribute("aria-hidden", String(!deveAguardarRotacao));
}

function precarrecarImagem(caminho) {
  const imagem = new Image();
  imagem.decoding = "async";
  imagem.src = caminho;
  imagem.decode?.().catch(() => {});
}

function executarPreFlight() {
  ["base1", "base13", "base22", "baseE"].forEach((nome) => {
    precarrecarImagem(`${CAMINHO_IMAGENS}/${nome}.webp`);
  });

  [app.somClique, app.somConfirma, app.somErro].forEach((som) => som?.load());
}

function iniciar() {
  registrarEventos();
  atualizarUrna();
  atualizarAvisoDeOrientacao();

  window.addEventListener("resize", atualizarAvisoDeOrientacao, { passive: true });
  window.addEventListener("orientationchange", atualizarAvisoDeOrientacao, { passive: true });
  window.addEventListener("load", () => {
    const agendar = window.requestIdleCallback ?? ((funcao) => window.setTimeout(funcao, 250));
    agendar(executarPreFlight);
  }, { once: true });
}

iniciar();
