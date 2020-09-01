const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    transform: transform,
    domain: 'coolblue.nl',
    zipcode: '',
  },
};
