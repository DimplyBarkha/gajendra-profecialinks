const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'coursesu',
    transform,
    domain: 'coursesu.com',
    zipcode: '76120',
  },
};
