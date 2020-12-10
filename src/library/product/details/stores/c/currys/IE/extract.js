const { transform } = require('../transform');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'currys',
    transform,
    domain: 'currys.ie',
    zipcode: 'D02TX94',
  },
  implementation,
};
