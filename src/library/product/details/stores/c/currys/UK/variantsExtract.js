const {transform} = require('./variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    transform,
    domain: 'currys.co.uk',
    zipcode: '',
  },
};
