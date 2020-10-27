const {transform} = require('../variantsFormat')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CL',
    store: 'ripley',
    transform,
    domain: 'ripley.cl',
    zipcode: '',
  },
};
