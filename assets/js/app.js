let firstCard = "",
  secondCard = "";

// let emojis = ["😂", "😀", "😃", "😋", "😛", "😓", "😖", "😏", "😱", "😎"],

let emojis = ["😂", "😃", "😎"],
  emojisD = [...emojis, ...emojis];
emojisD.sort(() => Math.random() - 0.5);

let segundos, minutos, horas, interval;

function temporizador() {
  interval = setInterval(() => {
    segundos = pegarEl(".temporizador .segundos");
    minutos = pegarEl(".temporizador .minutos");
    horas = pegarEl(".temporizador .horas");

    const tempoAtualSegundos = +segundos.innerHTML,
      tempoAtualMinutos = +minutos.innerHTML,
      tempoAtualHoras = +horas.innerHTML;
    segundos.innerHTML = tempoAtualSegundos + 1;

    if (segundos.innerHTML === "60") {
      segundos.innerHTML = "00";
      minutos.innerHTML = tempoAtualMinutos + 1;
    }
    if (minutos.innerHTML === "0") {
      minutos.innerHTML = "00";
      horas.innerHTML = tempoAtualHoras + 1;
    }

    if (horas.innerHTML === "24") {
      horas.innerHTML = "00";
    }
  }, 1000);
}

function pegarEl(el) {
  let elemento = document.querySelector(el);
  return elemento;
}

function checarFimJogo() {
  let cartasCertas = document.querySelectorAll(".certo");
  if (cartasCertas.length === emojisD.length) {
    clearInterval(interval);
    criarModal();
  }
}

function checarCartao() {
  const primeiroEmoji = firstCard.getAttribute("data-emojis"),
    segundoEmoji = secondCard.getAttribute("data-emojis");

  if (primeiroEmoji === segundoEmoji) {
    firstCard.lastChild.classList.add("certo");
    secondCard.lastChild.classList.add("certo");

    firstCard = "";
    secondCard = "";

    checarFimJogo();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("show");
      secondCard.classList.remove("show");
      firstCard = "";
      secondCard = "";
    }, 1500);
  }
}

function criarEl(el, className) {
  let elemento = document.createElement(el);
  elemento.classList.add(className);
  return elemento;
}

function clickedCard(target) {
  let condicao = target.className === "front",
    condicaoS = target.localName === "h2" || target.localName === "p";

  if (condicao) {
    if (target.parentNode.className.includes("show")) {
      return;
    }

    if (firstCard === "") {
      target.parentElement.classList.add("show");
      firstCard = target.parentElement;
    } else if (secondCard === "") {
      target.parentElement.classList.add("show");
      secondCard = target.parentElement;

      checarCartao();
    }
  }

  if (condicaoS) {
    if (target.parentElement.parentElement.className.includes("show")) {
      return;
    }

    if (firstCard === "") {
      target.parentElement.parentElement.classList.add("show");
      firstCard = target.parentElement.parentElement;
    } else if (secondCard === "") {
      target.parentElement.parentElement.classList.add("show");
      secondCard = target.parentElement.parentElement;
      checarCartao();
    }
  }
}

function criarCard(arr) {
  arr.forEach((arr) => {
    // Pegar elemento
    let game = pegarEl(".game"),
      header = pegarEl("header.nav"),
      footer = pegarEl("footer");

    // Criar elementos adicionar uma class no elementos
    let card = criarEl("div", "card"),
      front = criarEl("div", "front"),
      back = criarEl("div", "back");

    // Criar h2 e p
    header.innerHTML = `
      <h3>Nome: <span class="nome">Manuel Amad Charifo</span></h3>
      <h3>
        Tempo: 
        <span class="temporizador">
        <span class="horas">00</span>:<span class="minutos">00</span>:<span class="segundos">00</span>
      </h3>
    `;

    front.innerHTML = `
      <h2>Jogo da Memória</h2>
      <p>Cada pedaço do jogo é uma memória</p>
      <p>guardada</p>
      `;
    back.innerHTML = `
    <p>Lembre-se ai</p>
    <h2>${arr}</h2>
      `;

    footer.innerHTML = `
    <h3>Nr de cartas: <span class="nome">${emojisD.length}</span></h3>
    <h3>Nivel: <span class="nome">1</span></h3>
    `;

    // Adicionar elementos no elemento pai
    card.append(front);
    card.append(back);
    card.setAttribute("data-emojis", arr);

    card.onclick = ({ target }) => {
      clickedCard(target);
    };

    game.append(card);
  });
}

function iniciar() {
  temporizador();
  criarCard(emojisD);
}

function criarModal() {
  let modal = criarEl("div", "modal"),
    overlay = pegarEl(".overlay");

  modal.innerHTML = `
      <div class="flex">
        <h3>Nome: <span class="nome">Manuel Amad Charifo</span></h3>
        <h3>Nivel: <span class="nome">1</span></h3>
      </div>
      <div class="tempo flex">
        <h4>Tempo de Jogo:</h4>
        <h2><span class="horas">${horas.innerText}</span>:<span class="minutos">${minutos.innerText}</span>:<span class="segundos">${segundos.innerText}</span></h2>
        <p>Parabéns você venceu o nível 1 no tempo: ${horas.innerText} : ${minutos.innerText} : ${segundos.innerText}</p>
        <button class="next">Proximo Nivel</button>
      </div>
    `;

  overlay.append(modal);
  setTimeout(() => {
    overlay.style.display = "flex";
  }, 1000);
}

iniciar();
