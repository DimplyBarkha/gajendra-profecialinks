// const { transform } = require('../../../../transform');
const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared.js');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonApparel',
    domain: 'amazon.de',
    transform: transform,
  },
  implementation,
};
