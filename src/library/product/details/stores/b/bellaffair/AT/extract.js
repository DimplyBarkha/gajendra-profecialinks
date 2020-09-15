const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'bellaffair',
    transform,
    domain: 'bellaffair.at',
    zipcode: '',
  },
};
