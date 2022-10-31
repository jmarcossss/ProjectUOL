let nomeUsuario = '';
const url = "https://mock-api.driven.com.br/api/v6/uol";
const tempo_att = 4000;
const tempo_conect_msg = 2000;
let mensagens = [];

solicitaNomeUsuario();

function solicitaNomeUsuario() {

  nomeUsuario = prompt("Qual o seu nome?");
  const promise = axios.post(`${url}/participants`, {name: nomeUsuario});
  promise.then(carregarMensagens); //caso conecte, vamos mostrar as mensagens
  promise.catch(solicitaNomeUsuario); //caso contrário, pedimos o nome de novo
}

// function usuarioValido(resposta) {
//   alert('Usuário Valido');
//   carregarMensagens();
// }

// function usuavioInvalido(resposta) {
//   alert('Usuário Inválido, digite outro nome');
//   solicitaNomeUsuario();
// }

function confirmaConexao() {

  const promise = axios.post(`${url}/status`, {name: nomeUsuario});

  promise.then(usuarioConectado);
  promise.catch(usuarioNaoConectado);
}

//////////////////////////

//Vai lá na api das mensagens para pegar as mensagens de lá
function carregarMensagens() {
  //setInterval(carregarMensagens, tempo_conect_msg);
  const promise = axios.get(`${url}/messages`);

  promise.then(renderizarMensagens);
  promise.catch("Deu ruim");
}

//Vai printar as mensagens, em ordem, da forma como elas vieram lá da api de mensagens
function renderizarMensagens(resposta) {
  mensagens = resposta.data;

  const ul = document.querySelector(".mensagens");

  ul.innerHTML = null;

  for (let i = 0; i < mensagens.length; i++) {

      if(mensagens[i].type == "status"){
        ul.innerHTML = ul.innerHTML + `
      <li class = "mensagem alerta-entrada">
      <span><span class = "horario">${mensagens[i].time}</span><strong>${mensagens[i].from}</strong> ${mensagens[i].text}</span>
      </li>
      `;}

      else if(mensagens[i].type == "private_message"){
        ul.innerHTML = ul.innerHTML + `
      <li class = "mensagem alerta-entrada">
      <span><span class = "horario">${mensagens[i].time}</span><strong>${mensagens[i].from}</strong> ${mensagens[i].text}</span>
      </li>
      `;}
      
      else if(mensagens[i].type == "message"){
        ul.innerHTML = ul.innerHTML + `
      <li class = "mensagem alerta-entrada">
      <span><span class = "horario">${mensagens[i].time}</span><strong>${mensagens[i].from}</strong> ${mensagens[i].text}</span>
      </li>
      `;}

      

      // if(mensagens[i].type == "status"){
      //   ul.innerHTML = ul.innerHTML + `
      // <li class = "mensagem alerta-entrada">
      // <span><span class = "horario">${mensagens[i].time}</span><strong>${mensagens[i].from}</strong> ${mensagens[i].text}</span>
      // </li>
      // `;}

      // if(mensagens[i].type == "private_message"){
      //   ul.innerHTML = ul.innerHTML + `
      // <li class = "mensagem alerta-entrada">
      // <span><span class = "horario">${mensagens[i].time}</span><strong>${mensagens[i].from}</strong> ${mensagens[i].text}</span>
      // </li>
      // `;}
      
      // if(mensagens[i].type == "message"){
      //   ul.innerHTML = ul.innerHTML + `
      // <li class = "mensagem alerta-entrada">
      // <span><span class = "horario">${mensagens[i].time}</span><strong>${mensagens[i].from}</strong> ${mensagens[i].text}</span>
      // </li>
      // `;}

  }
  
  let elementoQueQueroQueApareca = document.querySelector('ul').lastElementChild
  elementoQueQueroQueApareca.scrollIntoView();

}

setInterval(confirmaConexao, tempo_att);
setInterval(carregarMensagens, tempo_conect_msg);

function usuarioConectado(resposta) {
}

function usuarioNaoConectado(resposta) {
  alert("Erro, usuário não está mais conectado");
}

function erroMensagens(resposta) {
  alert('Erro ao carregar as mensagens');
}

// function erroNoEnvio(resposta) {
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

  promise.then(carregarMensagens);
  promise.catch('Deu ruim');

  mensagemEnviada.value = '';

}