
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'ferguson.com',
    usernameSelector: '#email',
    passwordSelector: '#js-loginpage-password',
    buttonSelector: '#js-loginpage-login',
    loggedInSelector: null,
    country: 'US',
    store: 'ferguson',
    zipcode: '',
  },
};
