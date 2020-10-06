
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'veepee.es',
    usernameSelector: 'input[name="Mail"]',
    passwordSelector: 'input[name="Password"]',
    buttonSelector: '#loginBtn',
    loggedInSelector: 'input:not(#loginBtn)',
    country: 'ES',
    store: 'ventePrivee',
    zipcode: '',
  },
};
