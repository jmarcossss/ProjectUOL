let nomeUsuario = '';
const url = "https://mock-api.driven.com.br/api/v6/uol";
const tempo_att = 5000;
const tempo_conect_msg = 3000;
let APIMsgs = []; //Mensages from API aqui

function solicitaNomeUsuario() {

  nomeUsuario = prompt("Qual o seu nome?");
  const promise = axios.post(`${url}/participants`, {name: nomeUsuario});
  promise.then(takeMensagesFromAPI); //caso conecte, vamos mostrar as mensagens
  promise.catch(solicitaNomeUsuario); //caso contrário, pedimos o nome de novo
}

//Mantendo conexão com o servidor
function conectarAoServer() {
  const promise = axios.post(`${url}/status`, {name: nomeUsuario});
  promise.then('Conectado');
  promise.catch(usuarioNaoConectado);
}

//Vai lá na api das mensagens para pegar as mensagens de lá
function takeMensagesFromAPI() {
  const promise = axios.get(`${url}/messages`);
  promise.then(mensagesInScreen);
  promise.catch("Deu ruim");
}

//Vai printar as mensagens, em ordem, da forma como elas vieram lá da api de mensagens
function mensagesInScreen(answFromAPI) {
  APIMsgs = answFromAPI.data;
  const ul = document.querySelector(".mensagens");
  ul.innerHTML = null;
  for (let i = 0; i < APIMsgs.length; i++) {
    if(APIMsgs[i].type == "status") {
      ul.innerHTML += `
      <li class = "mensagem alerta-entrada">
      <span><span class = "horario">${APIMsgs[i].time}</span><strong>${APIMsgs[i].from}</strong> ${APIMsgs[i].text}</span>
      </li>
      `;
    }

    else if(APIMsgs[i].type == "private_message") {
      ul.innerHTML += `
      <li class = "mensagem alerta-entrada">
      <span><span class = "horario">${APIMsgs[i].time}</span><strong>${APIMsgs[i].from}</strong> ${APIMsgs[i].text}</span>
      </li>
      `;
    }

    else if(APIMsgs[i].type == "message") {
      ul.innerHTML += `
      <li class = "mensagem alerta-entrada">
      <span><span class = "horario">${APIMsgs[i].time}</span><strong>${APIMsgs[i].from}</strong> ${APIMsgs[i].text}</span>
      </li>
      `;
    }
      
  }

  let msgNaTela = document.querySelector('ul').lastElementChild
  msgNaTela.scrollIntoView();
}

setInterval(conectarAoServer, tempo_att);
setInterval(takeMensagesFromAPI, tempo_conect_msg);

// function usuarioConectado(answFromAPI) {
// }

function usuarioNaoConectado(answFromAPI) {
  alert("Erro, usuário não está mais conectado");
}

function erroMensagens(answFromAPI) {
  alert('Erro ao carregar as mensagens');
}

// function erroNoEnvio(answFromAPI) {
//   alert("Erro ao enviar a mensagem")
// }

//A mensagem está enviando com um delay de uns 8 segundos
function enviarMensagem() {
  const mensagemEnviada = document.querySelector('textarea');

  const mensagemObjeto = {
      from: nomeUsuario,
      to: "Todos",
      text: mensagemEnviada.value,
      type: "message"
  }

  const promise = axios.post(`${url}/messages`, mensagemObjeto);

  promise.then(takeMensagesFromAPI);
  promise.catch('Deu ruim');

  mensagemEnviada.value = '';

}

solicitaNomeUsuario();