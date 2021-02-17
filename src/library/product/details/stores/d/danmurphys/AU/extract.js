const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'danmurphys',
    transform,
    domain: 'danmurphys.com.au',
    zipcode: '',
  },
};
