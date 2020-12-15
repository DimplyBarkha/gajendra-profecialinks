const { transform } = require('../../../u/ubaldi/FR/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    transform,
    domain: 'ubaldi.fr',
    zipcode: '',
  },
};
