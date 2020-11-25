const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'belgique-incontinence',
    transform,
    domain: 'belgique-incontinence.be',
    zipcode: '',
  },
};
