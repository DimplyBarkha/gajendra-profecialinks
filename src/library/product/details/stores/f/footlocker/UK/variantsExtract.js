const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'footlocker',
    transform: cleanUp,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },
};
