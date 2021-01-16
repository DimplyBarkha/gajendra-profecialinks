const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'procurator',
    transform,
    domain: 'procurator.net',
    zipcode: '',
  },
};
