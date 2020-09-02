const { transform } = require('../transform');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'currys',
    transform,
    domain: 'currys.ie',
    zipcode: 'D02TX94',
  },
  implementation,
};
