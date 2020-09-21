// const { transform } = require('../../../../shared');

const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'ottoversand',
    transform,
    domain: 'ottoversand.at',
    zipcode: '',
  },
};
