const { transform } = require('../../../a/amazon/sharedTransform');
const { implementation } = require('../../../a/amazon/shared.js');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'Freshamazon',
    transform: transform,
    domain: 'amazon.de',
    zipcode: '10243',
  },
  implementation,
};

