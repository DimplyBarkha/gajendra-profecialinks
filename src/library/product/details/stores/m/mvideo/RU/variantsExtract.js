const { transform } = require('../variantFormat');
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
