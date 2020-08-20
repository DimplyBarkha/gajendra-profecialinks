const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.ie',
    zipcode: '',
  },
};
