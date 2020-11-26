const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'nordicfeel',
    transform,
    domain: 'nordicfeel.se',
    zipcode: '',
  },
};
