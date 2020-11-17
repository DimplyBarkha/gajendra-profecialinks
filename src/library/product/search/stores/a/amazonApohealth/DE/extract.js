const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared.js');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonApohealth',
    transform,
    domain: 'amazon.de',
  },
  implementation,
};
