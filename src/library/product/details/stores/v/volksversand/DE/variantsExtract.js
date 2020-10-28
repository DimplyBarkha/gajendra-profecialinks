const {transform} = require('../variantsFormat')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'volksversand',
    transform,
    domain: 'volksversand.de',
    zipcode: '',
  },
};
