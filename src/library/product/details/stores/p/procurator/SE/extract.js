const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'procurator',
    transform,
    domain: 'procurator.net',
    zipcode: '',
  },
};
