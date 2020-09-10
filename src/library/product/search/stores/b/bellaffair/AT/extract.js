const { transform } = require('./../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'bellaffair',
    transform,
    domain: 'bellaffair.at',
  },
};
