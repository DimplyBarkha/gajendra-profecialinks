const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'tesco',
    transform,
    domain: 'tesco.ie',
    zipcode: '',
  },
};
