// const { parameterValues } = require("../am/amazon.com");

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'newegg.com',
    timeout: null,
    country: 'US',
    store: 'newegg',
    zipcode: '',
  },
};
