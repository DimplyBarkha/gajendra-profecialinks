const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'eipublicanpartnerships',
    transform: transform,
    domain: 'eipublicanpartnerships.com',
    zipcode: '',
  },
};
