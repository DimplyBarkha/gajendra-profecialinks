
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'electrictobacconist',
    transform,
    domain: 'electrictobacconist.co.uk',
    zipcode: '',
  },
};
