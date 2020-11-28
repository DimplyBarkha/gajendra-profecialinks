const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'LV',
    store: 'barbora',
    transform,
    domain: 'barbora.lv',
    zipcode: '',
  },
};
