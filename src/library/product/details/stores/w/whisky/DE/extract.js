const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    transform,
    domain: 'whisky.de',
  },
};
