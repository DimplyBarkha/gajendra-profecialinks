const { transform } = require('../../../../sharedAmazon/transformNew');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    transform,
    domain: 'amazon.it',
    zipcode: '',
  },
};
