const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'supervalu',
    transform,
    domain: 'supervalu.ie',
    zipcode: '',
  },
};
