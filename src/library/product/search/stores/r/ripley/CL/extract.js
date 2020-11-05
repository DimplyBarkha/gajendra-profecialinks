const {transform} = require('../CL/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CL',
    store: 'ripley',
    transform,
    domain: 'simple.ripley.cl',
    zipcode: '',
  },
};
