
const {transform} = require('./variantsFormat')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'globus',
    transform,
    domain: 'globus.ch',
    zipcode: '',
  },
};
