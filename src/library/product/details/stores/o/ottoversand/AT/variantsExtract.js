const { transform } = require('./variantsTransform');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AT',
    store: 'ottoversand',
    transform,
    domain: 'ottoversand.at',
    zipcode: '',
  },
};
