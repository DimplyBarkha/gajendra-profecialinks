const { transform } = require('../variantTransform');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
