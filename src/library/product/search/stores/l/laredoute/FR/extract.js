const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'laredoute',
    transform,
    domain: 'laredoute.fr',
    zipcode: '',
  },
};
