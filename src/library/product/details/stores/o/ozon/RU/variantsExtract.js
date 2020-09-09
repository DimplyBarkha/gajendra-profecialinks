const {transform} = require('../variantsTransform')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    transform,
    domain: 'ozon.ru',
    zipcode: '',
  },
};
