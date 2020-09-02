
const { transform } = require('../transform');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    transform,
    domain: 'currys.co.uk',
    zipcode: 'SE19QY',
  },
  implementation,
};
