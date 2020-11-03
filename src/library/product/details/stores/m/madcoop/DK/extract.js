const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'madcoop',
    transform,
    domain: 'madcoop.dk',
    zipcode: '',
  },
};
