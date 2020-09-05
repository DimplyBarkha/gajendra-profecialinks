const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    transform: transform,
    domain: 'coolblue.be',
    zipcode: '',
  },
};
