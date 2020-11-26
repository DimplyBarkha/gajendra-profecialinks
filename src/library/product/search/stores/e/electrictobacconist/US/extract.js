
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'electrictobacconist',
    transform,
    domain: 'electrictobacconist.com',
    zipcode: '',
  },
};
