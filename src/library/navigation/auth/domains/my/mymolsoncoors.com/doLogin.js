
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'mymolsoncoors.com',
    usernameSelector: '#emailField',
    passwordSelector: '#passwordField',
    buttonSelector: 'input[type=button][value=Login]',
    loggedInSelector: '#account-label',
    country: 'UK',
    store: 'molsoncoors',
    zipcode: "''",
  },
};
