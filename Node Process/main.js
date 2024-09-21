const proxy = require('./proxy');

proxy.addMessageListener(onMessage);

function onMessage(data) {
    console.log(data);
}