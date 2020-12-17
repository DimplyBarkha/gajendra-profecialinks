
module.exports = {
  implements: 'navigation/auth/doLogin',
  parameterValues: {
    domain: 'shoplink.ie',
    usernameSelector: '#Username',
    passwordSelector: '#Password',
    buttonSelector: 'span.card.login button',
    loggedInSelector: 'div.department-tiles-box',
    country: 'IE',
    store: 'shoplink',
    zipcode: "''",
  },
};
