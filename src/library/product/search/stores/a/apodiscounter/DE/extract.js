var { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'apodiscounter',
    transform,
    domain: 'apodiscounter.de',
    zipcode: '',
  },
};
