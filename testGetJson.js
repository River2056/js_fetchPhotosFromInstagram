const accounts = require('./accounts.json');

const account = accounts.filter(e => e.username.startsWith('tommy'))[0];
console.log(account);