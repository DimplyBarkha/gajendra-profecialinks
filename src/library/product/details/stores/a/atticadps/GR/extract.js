const { transform } = require('../transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GR',
    store: 'atticadps',
    transform,
    domain: 'atticadps.gr',
    zipcode: '',
  },
};
