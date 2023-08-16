const grid = document.querySelector(".grid"),
  spanPlayer = document.querySelector(".player"),
  spanTimer = document.querySelector(".timer"),
  spanItem = document.querySelector(".item-nr"),
  spanNivel = document.querySelector(".nivel"),
  maxCharacters = 50;

let interval,
  segundos,
  minutos,
  horas,
  currentLevel = 1;

let firstCard = "",
  secondCard = "";

  const getCharacters = () => {
    const storedCharacters = localStorage.getItem('characters');
    return storedCharacters ? JSON.parse(storedCharacters) : ["1", "2", "3", "4"];
  };
  
  let characters = getCharacters();

const setCharacters = (charactersArray) => {
  localStorage.setItem('characters', JSON.stringify(charactersArray));
};


const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const selectElement = (el) => {
  let element = document.querySelector(el);
  return element;
};

const increaseCharacters = () => {
  const newCharacter = (currentLevel + 3).toString(); // Start with 4 characters for level 1
  characters.push(newCharacter);
  setCharacters(characters); // Save updated characters array to local storage
};

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll(".disabled-card");

  if (disabledCards.length === characters.length * 2) {
    clearInterval(interval);
    createModal();
  }
};

const closeModal = () => {
  const modal = selectElement(".modal");
  const overlay = selectElement(".overlay .container");

  modal.remove();
  overlay.style.display = "none";
};

const resetTimer = () => {
  segundos.innerHTML = "00";
  minutos.innerHTML = "00";
  horas.innerHTML = "00";
};

const loadNextLevel = () => {
  clearInterval(interval);
  resetTimer();
  currentLevel++;
  setCurrentLevel(currentLevel);
  spanNivel.innerText = currentLevel;

  increaseCharacters(); // Increase characters based on the current level
  setCharacters(characters); // Save updated characters array to local storage

  startTimer();
  grid.innerHTML = "";
  loadGame();
  closeModal();
};

const saveGameTime = (time) => {
  const records = JSON.parse(localStorage.getItem("gameRecords")) || [];
  if (records.length > 0) {
    const lastRecord = records[records.length - 1];
    lastRecord.level = currentLevel;
    lastRecord.time = time;
    localStorage.setItem("gameRecords", JSON.stringify(records));
  }
};

const saveGameRecord = () => {
  const playerName = spanPlayer.innerText;
  const level = parseInt(spanNivel.innerText);
  const time = `${horas.innerText}:${minutos.innerText}:${segundos.innerText}`;

  const records = JSON.parse(localStorage.getItem("gameRecords")) || [];
  
  // Check if a record for the player already exists
  const existingRecordIndex = records.findIndex(record => record.player === playerName);
  
  if (existingRecordIndex !== -1) {
    // Update existing record
    records[existingRecordIndex].level = level;
    records[existingRecordIndex].time = time;
  } else {
    // Create a new record
    const record = {
      player: playerName,
      level: level,
      time: time,
    };
    records.push(record);
  }
  
  localStorage.setItem("gameRecords", JSON.stringify(records));
};

const createModal = () => {
  let modal = createElement("div", "modal");
  overlay = selectElement(".overlay .container");

  modal.innerHTML = `
      <div class="flex">
        <h3>Nome: <span class="nome">${spanPlayer.innerText}</span></h3>
        <h3>Nivel: <span class="nome">${spanNivel.innerText}</span></h3>
      </div>
      <div class="tempo flex">
        <h4>Tempo de Jogo:</h4>
        <h2><span class="hora">${horas.innerText}h </span>:<span class="minutos">${minutos.innerText}m </span>:<span class="segundos">${segundos.innerText}s </span></h2>
        <p>Parabéns ${spanPlayer.innerText} você venceu o nível ${spanNivel.innerText}</p>
        <button class="next">Proximo Nivel</button>
      </div>
    `;

  overlay.append(modal);
  setTimeout(() => {
    overlay.style.display = "flex";
    saveGameRecord();

    document.querySelector(".next").addEventListener("click", loadNextLevel);
  }, 1000);
};

const checkCard = () => {
  const firstCharacter = firstCard.getAttribute("data-character"),
    secondCharacter = secondCard.getAttribute("data-character");

  if (firstCharacter === secondCharacter) {
    firstCard.classList.add("disabled-card");
    secondCard.classList.add("disabled-card");

    firstCard = "";
    secondCard = "";

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("show");
      secondCard.classList.remove("show");

      firstCard = "";
      secondCard = "";
    }, 500);
  }
};

const showCard = ({ target }) => {
  if (target.parentNode.className.includes("show")) {
    return;
  }

  if (firstCard === "") {
    target.parentNode.classList.add("show");
    firstCard = target.parentNode;
  } else if (secondCard === "") {
    target.parentNode.classList.add("show");
    secondCard = target.parentNode;

    checkCard();
  }
};

const createCard = (character) => {
  const card = createElement("div", "card"),
    front = createElement("div", "face front"),
    back = createElement("div", "face back");

  front.style.backgroundImage = `url("../assets/img/${character}.jpg")`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", showCard);
  card.setAttribute("data-character", character);
  return card;
};

const loadGame = () => {
  const duplicatedCharacters = [...characters, ...characters];

  const shuffledArray = duplicatedCharacters.sort(() => Math.random() - 0.5);

  duplicatedCharacters.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
};

const getCurrentLevel = () => {
  return parseInt(localStorage.getItem("currentLevel")) || 1;
};

const setCurrentLevel = (level) => {
  localStorage.setItem("currentLevel", level);
};

const startTimer = () => {
  interval = setInterval(() => {
    segundos = selectElement(".temporizador .segundos");
    minutos = selectElement(".temporizador .minutos");
    horas = selectElement(".temporizador .horas");

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

    const time = `${horas.innerText}:${minutos.innerText}:${segundos.innerText}`;
    saveGameTime(time); // Save updated time to local storage
  }, 1000);
};

window.onload = () => {
  spanItem.innerText = characters.length;
  characters = getCharacters(); // Get characters from local storage
  currentLevel = getCurrentLevel();
  spanNivel.innerText = currentLevel;
  startTimer();
  loadGame();

  // Load game records from localStorage
  const records = JSON.parse(localStorage.getItem('gameRecords')) || [];
  spanPlayer.innerText = records[0]?.player || '';

  // Display records in console (you can customize this part)
  console.log('Game Records:');
  records.forEach(record => {
    console.log(`Player: ${record.player}, Level: ${record.level}, Time: ${record.time}`);
  });
};
