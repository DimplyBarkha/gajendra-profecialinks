const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CL',
    store: 'ripley',
    transform,
    domain: 'ripley.cl',
    zipcode: '',
  },
};
