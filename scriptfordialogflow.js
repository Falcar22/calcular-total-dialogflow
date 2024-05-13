const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // Habilita declarações de depuração da biblioteca

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // Função para calcular o valor total do pedido
  function calcularTotal(agent) {
    const quantidadeGrande = agent.parameters.quantidade_grande || 0;
    const quantidadeMedia = agent.parameters.quantidade_media || 0;
    const quantidadePequena = agent.parameters.quantidade_pequena || 0;
    const quantidadePromocao = agent.parameters.quantidade_promocao || 0;

    const precoGrande = 22.00;
    const precoMedia = 19.50;
    const precoPequena = 15.00;
    const precoPromocao = 14.00;

    const totalGrande = quantidadeGrande * precoGrande;
    const totalMedia = quantidadeMedia * precoMedia;
    const totalPequena = quantidadePequena * precoPequena;
    const totalPromocao = quantidadePromocao * precoPromocao;

    const totalPedido = totalGrande + totalMedia + totalPequena + totalPromocao;

    agent.add(`O total a pagar pelo pedido é R$ ${totalPedido.toFixed(2)}`);
  }

  // Mapeamento de intenções para funções
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', fallback);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('total', calcularTotal);

  agent.handleRequest(intentMap);
});