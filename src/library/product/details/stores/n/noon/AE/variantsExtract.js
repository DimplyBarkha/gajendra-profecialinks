const { transform } = require('../variantsTransform');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    transform,
    domain: 'noon.com',
    zipcode: '',
  },
};
