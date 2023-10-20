const socket = new WebSocket(WS_URL);
const body = document.querySelector('body');
const logo = document.getElementById('logo');
const messageDiv = document.getElementById('message');

function vibratePhone(timeMs) {
  if (navigator.vibrate) {
    navigator.vibrate(timeMs);
  }
}

function setClientState(state, code = '') {
  body.className = 'main';
  messageDiv.classList.toggle('hide-message', true);
  logo.classList.toggle('stop-spin', false);
  logo.classList.toggle('spin-animation', true);

  setTimeout(() => {
    if (state === 'win') {
      body.classList.add('win');
      messageDiv.innerText = code;
      vibratePhone(1000);
    } else if (state === 'lose') {
      body.classList.add('lose');
      messageDiv.innerText = '';
    }

    messageDiv.classList.toggle('show-message', state === 'win');
    messageDiv.classList.toggle('hide-message', state !== 'win');
    logo.classList.toggle('spin-animation', false);
    logo.classList.toggle('stop-spin', true);
  }, 4100);
}

function handleServerMessage(event) {
  const data = JSON.parse(event.data);
  console.log('Mensagem recebida no servidor:', data);

  switch (data.status) {
    case STATUS.WIN:
      setClientState('win', data.code);
      break;
    case STATUS.LOSE:
      setClientState('lose');
      break;
    default:
      break;
  }
}

socket.addEventListener('message', handleServerMessage);
