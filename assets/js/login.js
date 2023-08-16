const input = document.querySelector(".input-texto"),
  button = document.querySelector(".play"),
  form = document.querySelector(".form");

const validateInput = ({ target }) => {
  if (target.value.length > 2) {
    button.removeAttribute("disabled");
    return;
  } else {
    button.setAttribute("disabled", "");
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const playerName = input.value;
  const level = 1;
  const time = '';
  const character = [];
  const record = {
    player: playerName,
    level: level,
    time: time,
    characters: character
  };

  const records = JSON.parse(localStorage.getItem('gameRecords')) || [];
  records.push(record);
  localStorage.setItem('gameRecords', JSON.stringify(records));
  window.location = "pages/game.html";
};

input.addEventListener("input", validateInput);
form.addEventListener("submit", handleSubmit);
