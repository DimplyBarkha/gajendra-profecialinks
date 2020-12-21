
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'shoprite.com',
    usernameSelector: '#Email',
    passwordSelector: '#Password',
    buttonSelector: '#SignIn',
    loggedInSelector: null,
    country: 'US',
    store: 'shoprite_08096',
    zipcode: '',
  },
};
