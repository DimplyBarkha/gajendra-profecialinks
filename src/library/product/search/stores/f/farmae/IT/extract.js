
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'farmae',
    transform,
    domain: 'farmae.it',
    zipcode: '',
  },
};
