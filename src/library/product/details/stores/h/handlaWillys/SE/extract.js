const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'handlaWillys',
    transform: transform,
    domain: 'willys.se',
    zipcode: '',
  },
};
