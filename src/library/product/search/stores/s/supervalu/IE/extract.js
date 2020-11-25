const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'supervalu',
    transform,
    domain: 'supervalu.ie',
    zipcode: '',
  },
};
