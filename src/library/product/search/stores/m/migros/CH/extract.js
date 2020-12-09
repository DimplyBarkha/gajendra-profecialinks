const {transform} = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    transform : transform,
    domain: 'migros.ch',
  },
};
