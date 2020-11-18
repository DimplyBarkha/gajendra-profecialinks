const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    transform,
    domain: 'meny.no',
    zipcode: '',
  },
};
